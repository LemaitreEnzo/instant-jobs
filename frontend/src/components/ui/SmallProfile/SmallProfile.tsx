import type { PropsSmallProfile } from '../../../types/props.type';
import './SmallProfile.css';

function SmallProfile(props: PropsSmallProfile) {
    const data = props.data;
    
  return (
    <div className='sp'>
        <div className='sp-left'>
            <div className='sp-first-letter'>
                <p>
                    {data.firstname[0].toUpperCase()}
                </p>
            </div>
            <div className='sp-fullname'>
                <p>
                    {`${data.firstname} ${data.lastname}`}
                </p>
            </div>
        </div>
        <div className='sp-right'>
            <div className='sp-right-content'>
                <p className='sp-right-default'>
                    Campus :
                </p>
                <p className='sp-right-data'>
                    Compiègne {/* To change */}
                </p>
            </div>
            <div className='sp-right-content'>
                <p className='sp-right-default'>
                    Promotion :
                </p>
                <p className='sp-right-data'>
                    Compiègne {/* To change */}
                </p>
            </div>
            <div className='sp-right-content'>
                <p className='sp-right-default'>
                    Spécialité :
                </p>
                <p className='sp-right-data'>
                    Compiègne {/* To change */}
                </p>
            </div>
            <div className='sp-right-content'>
                <p className='sp-right-default'>
                    Sous-spécialité :
                </p>
                <p className='sp-right-data'>
                    Compiègne {/* To change */}
                </p>
            </div>
            <div className='sp-right-content'>
                <p className='sp-right-default'>
                    Status :
                </p>
                <div className='sp-right-status'>
                    <div className='sp-right-ellipse'></div>
                    <p>
                        Compiègne {/* To change */}
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SmallProfile