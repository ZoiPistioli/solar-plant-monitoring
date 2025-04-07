import { useEffect, useState } from 'react';
import { Edit2, Trash2, CirclePlus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import styles from './PlantList.module.css';
import DataTable from '@/components/common/DataTable';
import ModalButton from '@/components/common/Modal/ModalButton';
import SolarPanelPlantForm from '@/components/plants/SolarPanelPlantForm';
import { SolarPlant } from '@/types';
import { apiService } from '@/services/apiService';
import { listUtils } from '@/utils/listUtils';
import { PlantListProps } from '@/types';

const PlantList = ({ onNavigate }: PlantListProps) => {
  const [solarPlants, setSolarPlants] = useState<SolarPlant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [sortKey, setSortKey] = useState<keyof SolarPlant | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const itemsPerPage = 10;

  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    fetchSolarPanelPlants();
  }, [currentPage, searchTerm]);

  const fetchSolarPanelPlants = async () => {
    if (isFetching) return;

    setIsFetching(true);
    setLoading(true);

    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const response = await apiService.getPlants(itemsPerPage, offset, searchTerm);

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        if ('count' in response.data && 'results' in response.data) {
          const { count, next, previous, results } = response.data;

          setTotalItems(count);
          setNextPageUrl(next);
          setPrevPageUrl(previous);

          const sorted = sortKey && sortDirection
            ? listUtils.sort(results, sortKey, sortDirection)
            : results;

          setSolarPlants(sorted);
        } else {
          const results = Array.isArray(response.data) ? response.data : [];
          setTotalItems(results.length);
          setNextPageUrl(null);
          setPrevPageUrl(null);

          const sorted = sortKey && sortDirection
            ? listUtils.sort(results, sortKey, sortDirection)
            : results;

          setSolarPlants(sorted);
        }

        setError(null);
      }
    } catch (err) {
      console.error('Error fetching plants:', err);
      setError('Failed to fetch plants. Check console for details.');
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  const handleDelete = async (plantUid: string) => {
    if (window.confirm('Are you sure you want to delete this plant?')) {
      const result = await apiService.deletePlant(plantUid);

      if (result.error) {
        setError("Failed to delete plant: " + result.error);
        toast.error('Failed to delete plant');
      } else {
        toast.success('Plant deleted successfully');
        fetchSolarPanelPlants();
      }
    }
  };

  const handleView = (plant: SolarPlant) => {
    onNavigate(`/solar-panel-plants/${plant.uid}`);
  };

  const handleCreatePlant = async (plantData: { name: string }) => {
    setLoading(true);
    try {
      const response = await apiService.createPlant(plantData);

      if (response.error) {
        setError(response.error);
        toast.error('Failed to create plant');
        return;
      }

      toast.success('Plant created successfully');
      setCurrentPage(1);
      fetchSolarPanelPlants();
    } catch (err) {
      setError('Failed to create plant. Please try again.');
      toast.error('Error occurred during plant creation');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlant = async (plant: SolarPlant, updatedData: { name: string }) => {
    setLoading(true);
    try {
      const response = await apiService.updatePlant(plant.uid, updatedData);

      if (response.error) {
        setError(response.error);
        toast.error('Failed to update plant');
        return;
      }

      toast.success('Plant updated successfully');
      fetchSolarPanelPlants();
    } catch (err) {
      setError('Failed to update plant. Please try again.');
      toast.error('Error occurred during plant update');
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (key: string | null, direction: 'asc' | 'desc' | null) => {
    setSortKey(key as keyof SolarPlant | null);
    setSortDirection(direction);
    setCurrentPage(1);

    if (solarPlants.length > 0) {
      const sorted = listUtils.sort(solarPlants, key as keyof SolarPlant | null, direction);
      setSolarPlants(sorted);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (totalPages > 0 && newPage > totalPages)) return;
    if (loading || isFetching) return;

    setCurrentPage(newPage);
  };

  const handleSearchChange = (term: string) => {
    if (term !== searchTerm) {
      setSearchTerm(term);
      setCurrentPage(1);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      sortable: true
    },
    {
      key: 'uid',
      header: 'ID',
      sortable: true,
      render: (plant: SolarPlant) => (
        <span className={styles.idCell}>{plant.uid}</span>
      )
    }
  ];

  const renderActions = (plant: SolarPlant) => (
    <>
      <ModalButton
        buttonLabel=""
        modalTitle="Edit Entry"
        icon={<Edit2 size={16} />}
        buttonClassName={styles.editButton}
      >
        {({ onClose }) => (
          <SolarPanelPlantForm
            solarPlant={plant}
            onSubmit={(updatedPlant) => {
              handleUpdatePlant(plant, updatedPlant);
              onClose();
            }}
            onCancel={onClose}
          />
        )}
      </ModalButton>
      <button
        className={styles.deleteButton}
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(plant.uid);
        }}
      >
        <Trash2 size={16} />
      </button>
    </>
  );

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const tableStyles = {
    minHeight: `${itemsPerPage * 53 + 60}px`
  };

  return (
    <div className={styles.container}>
      <Toaster position="top-right" />

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Solar Panel Plants</h1>

          <ModalButton
            buttonLabel="Add Entry"
            modalTitle="Add New Entry"
            icon={<CirclePlus size={20} className={styles.buttonIcon} />}
            buttonClassName={styles.menuButton}
          >
            {({ onClose }) => (
              <SolarPanelPlantForm
                onSubmit={(plantData) => {
                  handleCreatePlant(plantData);
                  onClose();
                }}
                onCancel={onClose}
              />
            )}
          </ModalButton>
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.tableWrapper} style={tableStyles}>
        <DataTable
          data={solarPlants}
          columns={columns}
          keyExtractor={(item) => item.uid}
          searchFields={['name', 'uid']}
          isLoading={loading}
          onRowClick={handleView}
          actions={renderActions}
          onSearchChange={handleSearchChange}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          hasNextPage={!!nextPageUrl}
          hasPrevPage={!!prevPageUrl}
          serverSidePagination={true}
        />
      </div>
    </div>
  );
};

export default PlantList;
