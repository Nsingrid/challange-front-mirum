import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {useParams, Redirect} from 'react-router-dom'
import imgProfile from "../assets/imgs/profile.jpg";

function Profile(props) {
    const [userData, setUserData] = useState(false)
    const [userInteresse, setUserInteresse] = useState({})
    const [redirect, setRedirect] = useState(false);

    let {email} = useParams();

    useEffect(() => {


        let config = {
            method: 'get',
            url: `http://localhost:3000/users?email=${email}`,
        };

        axios(config)
            .then((response) => {
                setUserData(response.data[0])
                let interesse = JSON.parse(response.data[0].interesse);
                setUserInteresse(interesse)
            })
            .catch((error) => {
                console.log(error);
            });

    }, [])

    if (redirect) {
        return <Redirect to={`/profile/edit/${userData.id}`}/>;

    } else {
        return (
            <section className="form__profile">
                <div className="container pt-5 pb-5">
                    <div className="row">
                        <div className="col-md-3">
                            <div style={{background: `url(${userData ? userData.profile_image : ''})`,}}
                                 className="img__profile"/>
                            <button onClick={() => setRedirect(true)} className="w-100 mt-2 btn btn-primary">Editar Perfil
                            </button>
                        </div>
                        <div className="col-md-9">
                            {userData ? (
                                <p>Eu sou <strong>{userData.nome} {userData.sobrenome}</strong> e eu tenho mais
                                    de <strong>{userData.idade == 0 ? '13' : ''} {userData.idade == 33 ? '20' : ''} {userData.idade == 66 ? '30' : ''} {userData.idade == 100 ? '45' : ''}</strong> anos
                                    e você pode enviar emails para <strong>{userData.email}</strong>. Eu moro no estado
                                    do <strong>{userData.estado}</strong>. Eu gosto
                                    de <strong>{userInteresse.length >= 1 ?
                                        userInteresse.map((interesse) => {
                                            return <span>{interesse.value},     </span>
                                        })
                                        : <></>}</strong>
                                    Por favor {userData.news ? 'me' : 'não me'} envie newsletters. Para me contatar
                                    ligue no
                                    telefone <strong>{userData.telefone}</strong></p>
                            ) : <></>}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Profile