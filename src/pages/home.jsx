import React from 'react';
import {Link} from 'react-router-dom';

// import { Container } from './styles';

function Home() {
    return (
        <section className="d-flex align-items-center min-vh-100">
            <div className="container h-100">
                <div className="row">
                    <div className="col text-center">
                        <Link to="/register" className="btn-primary">Cadastro</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Home;