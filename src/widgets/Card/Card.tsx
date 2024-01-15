import './Card.css'
import Button from 'react-bootstrap/Button';
import CardBootstrap from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setNumOfProdInReq } from '../../redux/filterAndActiveRequestID/actions';
import axios from 'axios';

interface CardProps {
    id: number;
    age: string;
    description: string;
    name: string;
    image: string;
    buttonAddClicked: () => void;
}

const MAX_DESCRIPTION_LENGTH = 100; 

const Card: React.FC<CardProps> = (props) => {
    const truncatedDescription = props.description.length > MAX_DESCRIPTION_LENGTH
        ? `${props.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
        : props.description;
        const numOfCons = useSelector((state: RootState) => state.filterAndActiveId.numOfCons);
        const dispatch = useDispatch();
    
        const handleAddToCard = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            console.log(event)
            try {
                event.preventDefault();
                await axios.post(
                    `/api/period/${props.id}/fossil`,
                    null,
                    {
                        headers: {
                            Authorization: `${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
                dispatch(setNumOfProdInReq((numOfCons + 1)));
                const currentNumOfCons = localStorage.getItem('numOfCons');
                const currentNum = currentNumOfCons ? parseInt(currentNumOfCons, 10) : 0;
                const updatedNumOfCons = currentNum + 1;
                localStorage.setItem('numOfCons', updatedNumOfCons.toString());
                if (updatedNumOfCons != numOfCons) {
                    dispatch(setNumOfProdInReq(updatedNumOfCons));
                }
                props.buttonAddClicked()
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    return (
        <CardBootstrap style={{ textDecoration: 'none', color: '#537459', width: '18rem', borderRadius: '20px', marginTop: '3rem', margin: '10% 10% 5% 10%' }}>
            <Link to={`/WebAppDev_front/period/${props.id}`} style={{ textDecoration: 'none', color: '#537459',margin: 'auto' }}>
            <CardBootstrap.Img variant="top" src={props.image} style={{width: '240px', height: '162px', borderRadius: '10px', display: 'block', margin: 'auto', marginTop: '20px'}}/>
            <CardBootstrap.Body style={{textDecoration: 'none'}}>
                <CardBootstrap.Title>{props.name} </CardBootstrap.Title>
                <CardBootstrap.Text>
                    {truncatedDescription}
                </CardBootstrap.Text>
                <>
                    
                        <Button variant="primary" onClick={handleAddToCard} style={{ margin: 'auto', borderColor: '#537459', borderRadius: '10px' ,backgroundColor: '#537459', color: '#d1e2d4' }}>Добавить</Button>
                    
                    <CardBootstrap.Text style={{ textDecoration: 'none', color: '#537459', display: 'inline-block', fontWeight: 'bold', marginTop: '2%' }}>
                    </CardBootstrap.Text>
                </>
            </CardBootstrap.Body>
            </Link>
        </CardBootstrap>
    );
}

export default Card;