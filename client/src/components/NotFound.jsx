import React from 'react'
import Second from './Second'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <Second>
            <section className="container text-center">
                <div className="mt-3">
                    <h3  style={{ color: " #e0245e" }} > 404 </h3>
                    <h4 style={{ color: " #e0245e" }} >Page Not Found</h4>
                    <h5 className="text-muted">Sorry, the page you are looking for does not exist.</h5>
                    <h5 className="text-muted">Please check the URL or go back to the {" "}
                        <Link to="/" className="text-decoration-none text-dark " >
                            <button className=" btn text-decoration-none text-white " style={{ backgroundColor: " #e0245e" , borderRadius: "20px" }} >
                                <i className="fa-solid fa-house me-2"></i>Home.
                            </button>
                        </Link>
                    </h5>
                    <br />
                    <div className="m-0">
                        <img src="https://i.pinimg.com/originals/e4/30/10/e430101033efff9a294eaafecbac846a.gif" width={600}  alt="404-img" />
                    </div>

                </div>
            </section>
        </Second>
    )
}

export default NotFound
