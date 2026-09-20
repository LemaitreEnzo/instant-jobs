import type { PersonalInformation } from '../../../types/global.type';
import type { PropsPersonalInformation } from '../../../types/props.type';
import './PersonalInformations.css';

function PersonalInformations(props: PropsPersonalInformation) {
    const data: PersonalInformation = props.data;
    const phone: string = data.phone.match(/.{1,2}/g)?.join(" ") ?? ""; // Format phone number

  return (
    <div className="PI">
        <div className="PI-header">
            <p>
                Infos personnelles
            </p>
            <div className="PI-edit">
                Modifier
                <div className='PI-edit-SVG'>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.71 7.04C21.1 6.65 21.1 6 20.71 5.63L18.37 3.29C18 2.9 17.35 2.9 16.96 3.29L15.12 5.12L18.87 8.87M3 17.25V21H6.75L17.81 9.93L14.06 6.18L3 17.25Z" fill="currentColor"/>
                    </svg>
                </div>
            </div>
        </div>
        <div className="PI-container">
            <div className="PI-content">
                <p className="PI-content-default">
                    Prénom :
                </p>
                <p className='PI-content-text'>
                    {data.firstname}
                </p>
            </div>
            <div className="PI-content">
                <p className="PI-content-default">
                    Nom :
                </p>
                <p className='PI-content-text'>
                    {data.lastname}
                </p>
            </div>
            <div className="PI-content">
                <p className="PI-content-default">
                    Email :
                </p>
                <p className='PI-content-text'>
                    {data.email}
                </p>
            </div>
            <div className="PI-content">
                <p className="PI-content-default">
                    Téléphone :
                </p>
                <p className='PI-content-text'>
                    {phone}
                </p>
            </div>
        </div>
    </div>
  )
}

export default PersonalInformations