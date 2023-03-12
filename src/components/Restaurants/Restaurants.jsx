import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../config/firebase';
import './restaurants.scss'
import Swal from 'sweetalert2'

const Restaurants = () => {

    const [restaurantes, setRestaurantes] = useState([]);
    const restaurantCollectionRef = collection(db, "restaurantes");

    const deleteRestaurant = async (id) => {
        Swal.fire({
            title: 'Silmək istədiyinizə əminsiniz?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sil',
            cancelButtonText: 'Ləğv et'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Silindi!',
                    'Your file has been deleted.',
                    'success'
                )
                const userDoc = doc(db, "restaurantes", id);
                deleteDoc(userDoc);
            }
        })

        // setDeletee(dlt)
    };

    useEffect(() => {
        const getRestaurantes = async () => {
            const data = await getDocs(restaurantCollectionRef);
            setRestaurantes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        getRestaurantes();
    }, [restaurantes]);
    return (
        <div id='restaurant'>

            <div className='container my-5'>
                <div className="row">
                    {
                        restaurantes &&
                        restaurantes.map((restaurant) => {
                            return (
                                <div className="col-lg-4 ">
                                    <div className="card">
                                        <div className="card-body">
                                            <img width="100%" src={restaurant.thumbImage} alt="" />
                                            <h5 className="card-title text-center">
                                                {restaurant.name}
                                            </h5>
                                        </div>
                                        <div className="card-footer">
                                            <div className="row text-center">
                                                <div className="col-lg-6">
                                                    <button className='btn btn-outline-danger w-100' onClick={() => {
                                                        deleteRestaurant(restaurant.id);
                                                    }} >Delete</button>
                                                </div>
                                                <div className="col-lg-6">
                                                    <Link
                                                        to="/restaurants/update/"
                                                        state={{
                                                            id: restaurant.id
                                                        }}
                                                    >
                                                        <button className='btn btn-outline-warning w-100' >Edit</button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )

                        })
                    }

                </div>

            </div>
            <div className="col-lg-4 my-4">
                <Link to="/restaurants/create">
                    <button className='btn btn-outline-success createButton'>Create</button>
                </Link>
            </div>
        </div>
    )
}

export default Restaurants