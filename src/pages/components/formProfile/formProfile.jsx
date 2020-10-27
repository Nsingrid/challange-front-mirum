import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Slider from '@material-ui/core/Slider';

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import Tags from "@yaireo/tagify/dist/react.tagify"
import "@yaireo/tagify/dist/tagify.css"

import iconClose from '../../../assets/imgs/close.svg';
import imgProfile from '../../../assets/imgs/profile.jpg';

const initialValuesForm = {
    nome: '',
    sobrenome: '',
    idade: 0,
    email: '',
    telefone: '',
    estado: '',
    pais: '',
    tipoEndereco: '',
    enderecoCasa: '',
    enderecoTrabalho: '',
    novidades: false
}

const initialInteresses = {
    interesse: [],
}

function FormProfile(props) {
    const [values, setValues] = useState(initialValuesForm);
    const [interesses, setInteresses] = useState(initialInteresses);
    const [profileImage, setProfileImage] = useState('');
    const [listPais, setListPais] = useState({});
    const [listEstados, setListEstados] = useState(false);

    const [VfyNome, setVfyNome] = useState(true)
    const [VfySobrenome, setVfySobrenome] = useState(true)
    const [VfyEmail, setVfyEmail] = useState(true)
    const [VfyTelefone, setVfyTelefone] = useState(true)
    const [VfyEstado, setVfyEstado] = useState(true)
    const [VfyPais, setVfyPais] = useState(true)
    const [VfyTipoEndereco, setVfyTipoEndereco] = useState(true)
    const [VfyEnderecoCasa, setVfyEnderecoCasa] = useState(true)
    const [VfyEnderecoTrabalho, setVfyEnderecoTrabalho] = useState(true)
    const [VfyImage, setVfyImage] = useState(true)

    const marks = [
        {value: 0, label: '13-19'},
        {value: 33, label: '20-29'},
        {value: 66, label: '30-45'},
        {value: 100, label: '45 e acima'}
    ];

    useEffect(() => {

        function getPais() {

            axios({
                "method": "GET",
                "url": "https://parseapi.back4app.com/classes/Country?limit=10000&order=name&excludeKeys=emoji,phone,currency,shape",
                "headers": {
                    'X-Parse-Application-Id': 'mxsebv4KoWIGkRntXwyzg6c6DhKWQuit8Ry9sHja', // This is the fake app's application id
                    'X-Parse-Master-Key': 'TpO0j3lG2PmEVMXlKYQACoOXKQrL3lwM0HwR9dbH', // This is the fake app's readonly master key
                }
            })
                .then((resp) => {
                    setListPais(resp.data)
                })
                .catch((error) => {
                    console.log(error)
                })
        }

        function validateForm() {
            let verify = true;

            const regexTamanho = /^[a-zA-Z]*^.{2,20}$/;
            const regexApenasCarateres = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/
            const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


            if (regexTamanho.test(values.nome) && regexApenasCarateres.test(values.nome)) {
                setVfyNome(true)
            } else {
                setVfyNome(false)
                verify = false;
            }

            if (values.sobrenome.length > 2) {
                setVfySobrenome(true)
            } else {
                setVfySobrenome(false)
                verify = false;
            }

            if (regexEmail.test(values.email)) {
                setVfyEmail(true)
            } else {
                setVfyEmail(false)
                verify = false;
            }

            if (values.telefone.length > 4) {
                setVfyTelefone(true)
            } else {
                setVfyTelefone(false)
                verify = false;
            }

            if (values.pais.length < 2) {
                setVfyPais(false)
                verify = false;
            } else {
                setVfyPais(true)
            }

            if (values.estado.length < 1) {
                setVfyEstado(false)
                verify = false;
            } else {
                setVfyEstado(true)
            }

            if (values.tipoEndereco === 'casa' || values.tipoEndereco === 'trabalho') {
                setVfyTipoEndereco(true)

                if (values.tipoEndereco === "casa") {
                    if (values.enderecoCasa.length > 1) {
                        setVfyEnderecoCasa(true)
                    } else {
                        setVfyEnderecoCasa(false)
                        verify = false;
                    }
                } else {
                    if (values.enderecoTrabalho.length > 1) {
                        setVfyEnderecoTrabalho(true)
                    } else {
                        setVfyEnderecoTrabalho(false)
                        verify = false;
                    }
                }
            } else {
                setVfyTipoEndereco(false)
                verify = false;
            }

            if (profileImage.length < 1) {
                setVfyImage(false)
                verify = false;
            } else {
                setVfyImage(true)
            }

            if (verify) {
                props.setData({'dados': values, 'interesses': interesses.interesse, 'profileImage': profileImage})
                props.setFormStatus(true)
                props.triggerFunction('trigger')
            }else{
                props.triggerFunction('trigger')
                props.setFormStatus(false)
            }
        }

        if (props.getData) {
            validateForm()
        }
        getPais()

    }, [props.triggerFunction]);

    function onChange(event) {
        const {value, name} = event.target;

        if (name === 'idade') {
            setValues({...values, idade: value})
        } else if (name === 'pais') {

            setValues({
                ...values,
                [name]: value,
            });

            const where = encodeURIComponent(JSON.stringify({
                "country": {
                    "__type": "Pointer",
                    "className": "Country",
                    "objectId": value
                }
            }));

            axios({
                "method": "GET",
                "url": `https://parseapi.back4app.com/classes/Subdivisions_States_Provinces?limit=999&where=${where}`,
                "headers": {
                    'X-Parse-Application-Id': 'mxsebv4KoWIGkRntXwyzg6c6DhKWQuit8Ry9sHja', // This is the fake app's application id
                    'X-Parse-Master-Key': 'TpO0j3lG2PmEVMXlKYQACoOXKQrL3lwM0HwR9dbH', // This is the fake app's readonly master key
                }
            })
                .then((resp) => {
                    setListEstados(resp.data)
                })
                .catch((error) => {
                    console.log(error)
                })

        } else {
            setValues({
                ...values,
                [name]: value,
            });
        }
    }

    function selectProfileImage(event) {
        setProfileImage(URL.createObjectURL(event.target.files[0]))
    }

    return (
        <section className="form__profile">
            <div className="container mt-4 mb-4">
                <div className="row">
                    <div className="col-md-3">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <div style={{background: `url(${profileImage ? profileImage : imgProfile})`,}}
                                     className="img__profile"/>
                            </div>
                            <div className="col-md-12 pt-3">
                                <div className="custom-file">
                                    <input type="file"
                                           className={VfyImage ? 'custom-file-input' : 'custom-file-input is-invalid'}
                                           id="customFile"
                                           onChange={selectProfileImage}/>
                                    <label className="custom-file-label" htmlFor="customFile">Escolha uma foto</label>
                                    <div className="invalid-feedback">
                                        Selecione uma foto de perfil válida.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="name">Nome</label>
                                <input
                                    type="text"
                                    className={VfyNome ? "form-control" : "form-control is-invalid"}
                                    name="nome"
                                    value={values.nome}
                                    placeholder="Digite seu primeiro nome"
                                    onChange={onChange}
                                />
                                <div className="invalid-feedback">
                                    O nome deve conter no maximo 20 caracteres.
                                </div>
                            </div>

                            <div className="form-group col-md-6">
                                <label htmlFor="sobrenome">Sobrenome</label>
                                <input
                                    type="text"
                                    name="sobrenome"
                                    className={VfySobrenome ? "form-control" : "form-control is-invalid"}
                                    value={values.sobrenome}
                                    placeholder="Digite seu sobrenome"
                                    onChange={onChange}
                                />
                                <div className="invalid-feedback">
                                    Porfavor preencha o campo
                                </div>
                            </div>
                        </div>

                        <Slider
                            defaultValue={values.idade}
                            aria-labelledby="discrete-slider-restrict"
                            onChange={(event, newValue) => onChange({target: {name: 'idade', value: newValue}})}
                            name="idade"
                            step={null}
                            valueLabelDisplay="off"
                            marks={marks}
                        />

                        <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                className={VfyEmail ? "form-control" : "form-control is-invalid"}
                                value={values.email}
                                placeholder="Digite seu e-mail"
                                onChange={onChange}
                            />
                            <div className="invalid-feedback">
                                O email digitado não é válido.
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="telefone">Telefone</label>
                            <PhoneInput
                                className={VfyTelefone ? "form-control d-flex" : "form-control d-flex is-invalid"}
                                onChange={(value) => setValues({...values, telefone: value})}
                                name="telefone"
                                placeholder="(00) 0000-0000"
                                value={values.telefone}/>
                            <div className="invalid-feedback">
                                Porfavor preencha este campo
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="pais">País</label>
                            <select
                                className={VfyPais ? "custom-select custom-select-md" : "custom-select custom-select-md is-invalid"}
                                value={values.pais} name="pais"
                                onChange={onChange}>
                                <option> Selecione o país</option>
                                {
                                    listPais.results ? listPais.results.map((item) => {
                                        return <option value={item.objectId}>{item.name}</option>
                                    }) : ''
                                }
                            </select>
                            <div className="invalid-feedback">
                                Por favor selecione um pais.
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="estado">Estado</label>
                            <select value={values.estado} name="estado"
                                    className={VfyEstado ? "custom-select custom-select-md" : "custom-select custom-select-md is-invalid"}
                                    onChange={onChange} disabled={!listEstados}>
                                <option>Selecione o estado</option>
                                {
                                    listEstados.results ? listEstados.results.map((item) => {
                                        return <option value={item.Subdivision_Name}>{item.Subdivision_Name}</option>
                                    }) : ''
                                }
                            </select>
                            <div className="invalid-feedback">
                                Por favor selecione um estado.
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="endereço">Endereço</label>
                            <select
                                className={VfyTipoEndereco ? "custom-select custom-select-md" : "custom-select custom-select-md is-invalid"}
                                value={values.tipoEndereco}
                                name="tipoEndereco"
                                onChange={onChange}>
                                <option value=""> Selecione</option>
                                <option value="casa">Casa</option>
                                <option value="trabalho">Trabalho</option>
                            </select>
                        </div>
                        <div className="invalid-feedback">
                            Por favor selecione um tipo de endereço.
                        </div>

                        {
                            values.tipoEndereco === 'casa' ?
                                <div className="form-group">
                                    <label htmlFor="name">Endereco Residencial</label>
                                    <input
                                        type="text"
                                        className={VfyEnderecoCasa ? "form-control" : "form-control is-invalid"}
                                        name="enderecoCasa"
                                        value={values.enderecoCasa}
                                        placeholder="Digite o endereço da sua casa"
                                        onChange={onChange}
                                    />
                                    <div className="invalid-feedback">
                                        Por favor preencha este campo.
                                    </div>
                                </div>
                                : ''
                        }
                        {
                            values.tipoEndereco === 'trabalho' ?
                                <div className="form-group">
                                    <label htmlFor="name">Endereço corporativo</label>
                                    <input
                                        type="text"
                                        className={VfyEnderecoTrabalho ? "form-control" : "form-control is-invalid"}
                                        name="enderecoTrabalho"
                                        value={values.enderecoTrabalho}
                                        placeholder="Digite o endereço do seu trabalho"
                                        onChange={onChange}
                                    />
                                    <div className="invalid-feedback">
                                        Por favor preencha este campo.
                                    </div>
                                </div>
                                : ''
                        }


                        <div className="form-group">
                            <label htmlFor="interesse">Interesse</label>
                            <Tags
                                className="custom-form-control"
                                value={interesses.interesse}
                                name="interesse"
                                onChange={(event) => setInteresses({interesse: event.target.value})}
                            />
                            <div className="invalid-feedback">
                                Por favor preencha este campo.
                            </div>
                            <small>Separe seus interesses por virgula</small>
                        </div>

                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" name="novidades"
                                   onChange={(event) => setValues({...values, novidades: !values.novidades})}
                                   id="newsCheck" checked={values.novidades}/>
                            <label className="form-check-label" htmlFor="newsCheck">Desejo receber
                                novidades por e-mail</label>
                        </div>

                        <button type="submit" className="btn__save text-center mt-4 d-flex">Salvar</button>
                    </div>
                </div>
            </div>
        </section>
    )
        ;
}

export default FormProfile;
