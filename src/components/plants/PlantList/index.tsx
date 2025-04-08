import { Edit2, Trash2, CirclePlus } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import styles from './PlantList.module.css';
import DataTable from '@/components/common/DataTable';
import ModalButton from '@/components/common/Modal/ModalButton';
import SolarPanelPlantForm from '@/components/plants/SolarPanelPlantForm';
import { SolarPlant, PlantListProps } from '@/types';
import usePlantData from '@/hooks/usePlantData';

function PlantList({ onNavigate }: PlantListProps) {
  const {
    plants: solarPlants,
    loading,
    error,
    currentPage,
    totalItems,
    totalPages,
    sortKey,
    sortDirection,
    nextPageUrl,
    prevPageUrl,
    handleDelete,
    handleCreatePlant,
    handleUpdatePlant,
    handleSortChange,
    handlePageChange,
    handleSearchChange
  } = usePlantData();

  const handleView = (plant: SolarPlant) => {
    onNavigate(`/solar-panel-plants/${plant.uid}`);
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

      <div className={styles.tableWrapper} style={{ minHeight: 'auto' }}>
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
          itemsPerPage={10}
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
}

export default PlantList;