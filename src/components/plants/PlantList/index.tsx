import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, CirclePlus } from 'lucide-react';
import styles from './PlantList.module.css';
import DataTable from '@/components/common/DataTable';
import ModalButton from '@/components/common/Modal/ModalButton';
import SolarPanelPlantForm from '@/components/plants/SolarPanelPlantForm';
import { SolarPlant } from '@/types';
import { service } from '@/services';
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
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSolarPanelPlants();
  }, []);

  const fetchSolarPanelPlants = async () => {
    setLoading(true);
    const response = await service.getPlants();

    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      const sorted = listUtils.sort(response.data, sortKey, sortDirection);
      setSolarPlants(sorted);
      setError(null);
    }

    setLoading(false);
  };

  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();

    if (window.confirm('Are you sure you want to delete this plant?')) {
      setLoading(true);
      const response = await service.deletePlant(id);

      if (response.error) {
        setError(response.error);
      } else {
        fetchSolarPanelPlants();
      }

      setLoading(false);
    }
  };

  const handleView = (plant: SolarPlant) => {
    onNavigate(`/plants/${plant.id}`);
  };

  const handleCreatePlant = async (plantData: { name: string }) => {
    setLoading(true);

    try {
      const response = await service.createPlant(plantData);

      if (response.error) {
        setError(response.error);
        return;
      }

      const newPlant = response.data;

      const updatedResponse = await service.getPlants();
      if (updatedResponse.error || !updatedResponse.data) {
        setError(updatedResponse.error || 'Failed to fetch plants');
        return;
      }

      const sorted = listUtils.sort(updatedResponse.data, sortKey, sortDirection);

      const index = newPlant ? sorted.findIndex(p => p.id === newPlant.id) : -1;
      const newPage = Math.floor(index / itemsPerPage) + 1;

      setSolarPlants(sorted);
      setCurrentPage(newPage);
    } catch (err) {
      setError('Failed to create plant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlant = async (plant: SolarPlant, updatedData: { name: string }) => {
    setLoading(true);

    try {
      const response = await service.updatePlant(plant.id, updatedData);

      if (response.error) {
        setError(response.error);
        return;
      }

      const updatedResponse = await service.getPlants();
      if (updatedResponse.error || !updatedResponse.data) {
        setError(updatedResponse.error || 'Failed to fetch plants');
        return;
      }

      const sorted = listUtils.sort(updatedResponse.data, sortKey, sortDirection);

      const index = sorted.findIndex(p => p.id === plant.id);
      const newPage = Math.floor(index / itemsPerPage) + 1;

      setSolarPlants(sorted);
      setCurrentPage(newPage);
    } catch (err) {
      setError('Failed to update plant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (key: string | null, direction: 'asc' | 'desc' | null) => {
    setSortKey(key as keyof SolarPlant | null);
    setSortDirection(direction);
    const sorted = listUtils.sort(solarPlants, key as keyof SolarPlant | null, direction);
    setSolarPlants(sorted);
    setCurrentPage(1);
  };
  
  const columns = [
    {
      key: 'name',
      header: 'Name',
      sortable: true
    },
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      render: (plant: SolarPlant) => (
        <span className={styles.idCell}>{plant.id}</span>
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
          handleDelete(plant.id, e);
        }}
      >
        <Trash2 size={16} />
      </button>
    </>
  );

  return (
    <div className={styles.container}>
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

      <div className={styles.tableWrapper}>
        <DataTable
          data={solarPlants}
          columns={columns}
          keyExtractor={(item: { id: any; }) => item.id}
          searchFields={['name', 'id']}
          isLoading={loading}
          onRowClick={handleView}
          actions={renderActions}
          onSearchChange={setSearchTerm}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
        />
      </div>
    </div>
  );
};

export default PlantList;