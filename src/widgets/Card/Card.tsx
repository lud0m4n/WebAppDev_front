import './Card.css'
import Button from 'react-bootstrap/Button';
import CardBootstrap from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

interface CardProps {
    id: number;
    age: string;
    description: string;
    name: string;
    image: string;
}

const MAX_DESCRIPTION_LENGTH = 100; 

const Card: React.FC<CardProps> = (props) => {
    const truncatedDescription = props.description.length > MAX_DESCRIPTION_LENGTH
        ? `${props.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
        : props.description;

    return (
        <CardBootstrap style={{ color: '#537459', width: '18rem', borderRadius: '20px', marginTop: '3rem', margin: '10% 10% 5% 10%' }}>
            <CardBootstrap.Img variant="top" src={props.image} style={{width: '240px', height: '162px', borderRadius: '10px', display: 'block', margin: 'auto', marginTop: '20px'}}/>
            <CardBootstrap.Body>
                <CardBootstrap.Title>{props.name} </CardBootstrap.Title>
                <CardBootstrap.Text>
                    {truncatedDescription}
                </CardBootstrap.Text>
                <>
                    <Link to={`/period/${props.id}`} style={{ marginRight: 'auto' }}>
                        <Button variant="primary" style={{ borderColor: '#537459', borderRadius: '10px' ,backgroundColor: '#537459', color: '#d1e2d4' }}>Подробнее</Button>
                    </Link>
                    <CardBootstrap.Text style={{ color: '#537459', display: 'inline-block', fontWeight: 'bold', marginTop: '2%' }}>
                    </CardBootstrap.Text>
                </>
            </CardBootstrap.Body>
        </CardBootstrap>
    );
}

export default Card;