import Card from "@/components/common/Card";
import PlantList from "@/components/plants/PlantList";
import { useNavigate } from 'react-router-dom';

function SolarPanelPlants() {
    const navigate = useNavigate();
    
    return (
        <Card>
            <PlantList onNavigate={(path) => navigate(path)} />
        </Card>
    );
}

export default SolarPanelPlants;