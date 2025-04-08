import Card from "@/components/common/Card";
import MonitoringDashboard from "@/components/plants/MonitoringDashboard";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiService } from "@/services/apiService"; 

function Monitoring() {
  const navigate = useNavigate();
  const { uid } = useParams();
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(uid || null);
  const [plantName, setPlantName] = useState<string | null>(null);

  useEffect(() => {
    if (uid) {
      apiService.getPlantById(uid) 
        .then((response) => {
          if (response.data) {
            const plant = response.data;
            setPlantName(plant.name);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch plant data:", err);
        });
    }
  }, [uid]);

  useEffect(() => {
    setSelectedPlantId(uid || null);
  }, [uid]);

  return (
    <Card>
      <MonitoringDashboard
        plantId={selectedPlantId}
        plantName={plantName} 
        onNavigate={navigate}
      />
    </Card>
  );
}

export default Monitoring;
