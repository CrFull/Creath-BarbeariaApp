import { useNavigate } from "react-router-dom";
import { Home, Clock, CalendarRange, MoreHorizontal } from 'lucide-react';
import { NavbarItem } from './navbar-item';
import { useAgendar } from "../../context/agendarContext";
import { useAuth } from "../../context/authcontext";

export function Navbar() {
    const navigate = useNavigate(); 
    const {agendamentos} = useAgendar();
    const {isLoggedIn} = useAuth();

    const handleAgendados = () => {
        if (agendamentos.length > 0 && !isLoggedIn) {
            navigate('/pedido')
        }
        else
            navigate('/agendamentos')

    }

    return (
        <div className="bg-customGray-100 w-full h-16 shadow-navbar fixed bottom-0 left-0 flex justify-evenly items-center z-50 
            md:flex-col md:w-16 md:h-full md:top-0 md:left-0 md:bottom-auto  
            max-sm:rounded-b-3xl md:px-10">
                <NavbarItem icon={Home} text="Início"onClick={() => navigate('/')} />
                <NavbarItem icon={Clock} text="Agendar"  onClick={() => navigate('/agendar')} />
                <NavbarItem icon={CalendarRange} text="Agendados" onClick={handleAgendados} />
                <NavbarItem icon={MoreHorizontal} text="Mais" onClick={() => navigate('/mais')}  />
        </div>
    );
}
