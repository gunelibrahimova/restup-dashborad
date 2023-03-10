import React, { useEffect, useRef, useState } from 'react'
import './restaurants.scss'
import ImageUploading from 'react-images-uploading';
import MapPicker from 'react-google-map-picker';
import { collection, addDoc, GeoPoint } from "firebase/firestore";
import { db } from "../../config/firebase";
import { storage } from "../../config/firebase"
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage"
import { v4 } from 'uuid';
import Swal from 'sweetalert2'
import { Box, FormControl, FormLabel, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Switch, TextField } from '@mui/material';
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';


const DefaultLocation = { lat: 40.4093, lng: 49.8671 };
const DefaultZoom = 10;




const CreateRestaurants = () => {
    const [restaurantName, setRestaurantName] = useState("")
    const [address, setAddress] = useState("")
    const [avgPrice, setAvaragePrice] = useState("")
    const [mainCuisine, setMainCuisine] = useState("")
    const [category, setCategory] = useState("")
    const [workingStartsAt, setWorkingStartsAt] = useState(new Date())
    const [endTime, setEndTime] = useState(new Date())
    const [reservStartTime, setReservStartTime] = useState(new Date())
    const [reservEndTime, setReservEndTime] = useState(new Date())
    const [socialNetworkAccount, setSocialNetworkAccount] = useState("")
    const [description, setDescription] = useState("")
    const [bookingAvailable, setBookingAvailable] = useState(true)
    const [maxAllowedGuests, setMaxAllowedGuests] = useState("")
    const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
    const [lat, setLat] = useState(defaultLocation.lat)
    const [lng, setLng] = useState(defaultLocation.lng)
    const [phoneNumbers, setPhoneNumbers] = useState([{ mobile: "" }]);
    // const [room, setRoom] = useState("")
    // const [roomCount, setRoomCount] = useState("")
    // const [roomTypes, setRoomTypes] = useState(["", ""]);
    const [roomTypes, setRoomTypes] = useState([
        { room: "", capacity: "" },
    ]);
    const [images, setImages] = useState([]);
    const [menu, setMenu] = useState("");
    const [location, setLocation] = useState(defaultLocation);
    const [zoom, setZoom] = useState(DefaultZoom);
    const [age, setAge] = React.useState('');
    const [thumbImage, setThumbImage] = useState("")

    const roomChange = (e, index) => {
        const list = [...roomTypes];
        console.log(roomTypes[0]);
        list[index].room = e.target.value
        setRoomTypes(list);

    };

    const roomRemove = (index) => {
        const list = [...roomTypes];
        list.splice(index, 2);
        setRoomTypes(list);


    };

    const roomAdd = () => {
        setRoomTypes([...roomTypes, { room: "", capacity: "" }]);

    };

    const capacityChange = (event, index) => {
        const newRoomTypes = [...roomTypes];
        newRoomTypes[index].capacity = event.target.value;
        setRoomTypes(newRoomTypes);
    }

    const emailRef = useRef(null);
    const passwordRef = useRef(null);


    //for upload image
    const uploadThumbImage = (image) => {
        if (image == null) return;
        const imageRef = ref(storage, `images/${v4() + image.name}`);
        uploadBytes(imageRef, image).then((value) => {
            getDownloadURL(imageRef).then((url) => {
                setThumbImage(url);
            });
        })
    };

    const uploadImages = async (imageFiles) => {
        if (imageFiles == null) return;
        for (let i = 0; i < imageFiles.length; i++) {
            let image = imageFiles[i];
            const imageRef = ref(storage, `images/${v4() + image.name}`);
            await uploadBytes(imageRef, image).then((value) => {
                getDownloadURL(imageRef).then((url) => {
                    images.push(url);
                    setImages([...images]);
                });
            })
        }
    };

    const removeImagesAtIndex = (index) => {
        images.splice(index, 1);
        setImages([...images]);
    }

    const menuListRef = ref(storage, "menu/");
    const uploadMenuFile = (file) => {
        if (file == null) return;
        const menuRef = ref(storage, `menu/${file.name}`);
        uploadBytes(menuRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setMenu(url);
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Your work has been saved',
                    showConfirmButton: false,
                    timer: 1500
                })
            });
        });
    };

    //for addorRemoveInput
    const phoneNumberChange = (e, index) => {
        const { value } = e.target;
        const list = [...phoneNumbers];
        list[index] = value;
        setPhoneNumbers(list);
    };

    const phoneNumberRemove = (index) => {
        const list = [...phoneNumbers];
        list.splice(index, 1);
        setPhoneNumbers(list);
    };

    const phoneNumberAdd = (e) => {
        setPhoneNumbers([...phoneNumbers, ""]);
    };



    function handleChangeLocation(lat, lng) {
        setLocation({ lat: lat, lng: lng });
        setLat(lat);
        setLng(lng)
    }

    function handleChangeZoom(newZoom) {
        setZoom(newZoom);
    }

    function handleResetLocation() {
        setDefaultLocation({ ...DefaultLocation });
        setZoom(DefaultZoom);
    }

    const changeMenuInput = (event) => {
        setAge(event.target.value)
    };
    const Save = async (e) => {
        try {
            createUserWithEmailAndPassword(auth,
                emailRef.current.value + "@gmail.com", passwordRef.current.value,
            ).then(user => {
                console.log('user : ', user);
                const roomTypesData = roomTypes.map(rooms => {
                    return {
                      room: rooms.room,
                      capacity: rooms.capacity
                    };
                  });
            
                addDoc(collection(db, "restaurants"), {
                    name: restaurantName,
                    phoneNumbers: phoneNumbers,
                    address: address,
                    avgPrice: avgPrice,
                    mainCuisine: mainCuisine,
                    category: category,
                    workingStartsAt: workingStartsAt,
                    workingEndsAt: endTime,
                    bookingStartsAt: reservStartTime,
                    bookingEndsAt: reservEndTime,
                    socialNetworkAccount: socialNetworkAccount,
                    description: description,
                    bookingAvailable: bookingAvailable,
                    maxAllowedGuests: parseFloat(maxAllowedGuests),
                    menu: menu,
                    location: new GeoPoint(lat, lng),
                    roomTypes: roomTypesData,

                    thumbImage: thumbImage,
                    images: images,
                    userId: user.user.uid
                });
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'M??lumat ??lav?? olundu',
                    showConfirmButton: false,
                    timer: 1500
                })
            }).catch(err => {
                console.log(err)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'X??ta ba?? verdi',
                })
            })

        }
        catch (err) {
            console.log(err)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'X??ta ba?? verdi',
            })
        }
    }

    Date.prototype.addHours = function (h) {
        this.setHours(this.getHours() + h);
        return this;
    }



    return (
        <div id='CreateRestaurants'>
            <TextField fullWidth id="outlined-basic" label="Restoran??n ad??" className='mb-4' variant="outlined" onChange={e => setRestaurantName(e.target.value)} />
            {phoneNumbers.map((singleService, index) => (

                <div key={index} className="row align-items-center justify-content-center">
                    <div className="col-lg-8">
                        <div className="first-division">
                            <TextField fullWidth id="outlined-basic" onChange={(e) => phoneNumberChange(e, index)} label="Mobil n??mr??" variant="outlined" />
                        </div>
                    </div>
                    <div className="col-lg-2">
                        <div className="second-division">
                            {phoneNumbers.length !== 1 && (
                                <button
                                    type="button"
                                    onClick={() => phoneNumberRemove(index)}
                                    className="remove-btn"
                                >
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-2">
                        {phoneNumbers.length - 1 === index && phoneNumbers.length < 100 && (
                            <button
                                type="button"
                                onClick={phoneNumberAdd}
                                className="add-btn"
                            >
                                <i class="fa-solid fa-plus"></i> <span>??lav?? et</span>
                            </button>
                        )}
                    </div>
                </div>
            ))}
            <TextField fullWidth id="outlined-basic" label="Adres" className='mb-4' variant="outlined" onChange={e => setAddress(e.target.value)} />
            {/* <TextField fullWidth id="outlined-basic" label="Orta qiym??t" className='mb-4' variant="outlined" onChange={e => setAvaragePrice(e.target.value)} /> */}
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Orta qiym??t</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    fullWidth label="Orta qiym??t" className='mb-4' variant="outlined" onChange={e => setAvaragePrice(e.target.value)}
                >
                    <MenuItem value={"Cheap"}>Ucuz</MenuItem>
                    <MenuItem value={"Medium"}>Orta</MenuItem>
                    <MenuItem value={"Expensive"}>Bahal??</MenuItem>
                </Select>
            </FormControl>
            <TextField fullWidth id="outlined-basic" label="??sas m??tb??x" className='mb-4' variant="outlined" onChange={e => setMainCuisine(e.target.value)} />
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Kateqoriya</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    fullWidth label="Kateqoriya" className='mb-4' variant="outlined" onChange={e => setCategory(e.target.value)}
                >
                    <MenuItem value={"Avropa m??tb??xi"}>Avropa m??tb??xi</MenuItem>
                    <MenuItem value={"Slavyan m??tb??xi"}>Slavyan m??tb??xi</MenuItem>
                    <MenuItem value={"Frans??z m??tb??xi"}>Frans??z m??tb??xi</MenuItem>
                    <MenuItem value={"??talyan m??tb??xi"}>??talyan m??tb??xi</MenuItem>
                    <MenuItem value={"Yapon m??tb??xi"}>Yapon m??tb??xi</MenuItem>
                    <MenuItem value={"Coffee and snacks"}>Coffee and snacks</MenuItem>
                    <MenuItem value={"Hind m??tb??xi"}>Hind m??tb??xi</MenuItem>
                    <MenuItem value={"Milli m??tb??x"}>Milli m??tb??x</MenuItem>
                    <MenuItem value={"Meksika m??tb??xi"}>Meksika m??tb??xi</MenuItem>
                </Select>
            </FormControl>
            <div className="workTime">
                <div className="row align-items-center">
                    <div className="col-lg-12">
                        <p>???? saatlar??</p>
                        <TextField
                            id="time"
                            label="Ba??lama saat??"
                            type="time"
                            className='startTime'
                            onChange={(e) => (
                                setWorkingStartsAt(e.target.valueAsDate.addHours(-4))
                            )}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300, // 5 min
                            }}
                            sx={{ width: 150 }}
                        />

                        <TextField
                            id="time"
                            label="Bitm?? saat??"
                            type="time"
                            onChange={(e) => (
                                setEndTime(e.target.valueAsDate.addHours(-4))
                            )}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300, // 5 min
                            }}
                            sx={{ width: 150 }}
                        />
                    </div>

                </div>
            </div>

            <TextField fullWidth id="outlined-basic" label="Sosial ????b??k?? hesab??" className='mb-4' variant="outlined" onChange={e => setSocialNetworkAccount(e.target.value)} />

            <TextField
                id="outlined-multiline-static"
                label="T??svir"
                multiline
                rows={4}
                fullWidth
                onChange={e => setDescription(e.target.value)}
            />
            <div className="row align-items-center">
                <div className="col-lg-6">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <span>Rezervasiya m??vcuddur</span>
                        </div>
                        <div className="col-lg-6 d-flex justify-content-end">
                            <FormLabel component="legend">
                                <Switch defaultChecked onChange={(e) => (
                                    setBookingAvailable(e.target.checked)
                                )} />
                            </FormLabel>
                        </div>
                    </div>
                </div>
                <div className={bookingAvailable ? "reserve col-lg-6" : "display"} >
                    <p>Rezerv saatlar??</p>
                    <TextField
                        id="time"
                        label="Ba??lama saat??"
                        type="time"
                        className='startTime'
                        onChange={(e) => (
                            setReservStartTime(e.target.valueAsDate.addHours(-4))
                        )}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                        sx={{ width: 150 }}
                    />

                    <TextField
                        id="time"
                        label="Bitm?? saat??"
                        type="time"
                        onChange={(e) => (
                            setReservEndTime(e.target.valueAsDate.addHours(-4))
                        )}

                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                        sx={{ width: 150 }}
                    />
                </div>


            </div>
            <div className="profilePhoto">
                <p>Profil ????kli</p>
                <div class="fileUpload">
                    <input
                        multiple
                        type="file"
                        id='upload_image'
                        className='upload-images'
                        onChange={(event) => { uploadThumbImage(event.target.files[0]) }}
                    />
                    <label class="file-input__label" for="upload_image">
                        <span>Upload file</span></label>
                </div>
                <img src={thumbImage} className="smallphoto" alt="" width="400" />
            </div>
            <div className="photos">
                <p>S??kill??r</p>

                <div className='fileUpload'>
                    <div class="file-input">
                        <input
                            multiple
                            type="file"
                            id='upload_images'
                            className='upload-images'
                            onChange={(event) => { uploadImages(event.target.files) }}
                        />
                        <label class="file-input__label" for="upload_images">
                            <span>Upload file</span></label
                        >
                    </div>
                    {images.map((image, index) => (
                        <div key={index} className="image-item">
                            <img src={image} className="smallphoto" alt="" width="200" />
                            <button
                                type="button"
                                onClick={() => removeImagesAtIndex(index)}
                                className="remove-btn"
                            >
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    ))}


                </div>

            </div>
            <TextField fullWidth id="outlined-basic" label="??caz?? veril??n ??n ??ox qonaq say??" className='mb-4 mt-4' type="number"
                onChange={(event) => (
                    event.target.value < 0
                        ? (event.target.value = 0)
                        : event.target.value,
                    setMaxAllowedGuests(event.target.value)
                )} variant="outlined" />
            {roomTypes.map((singleRoom, index) => (
                <div key={index} className="row align-items-center justify-content-center">
                    <div className="col-lg-4">
                        <div className="first-division">
                            <TextField fullWidth id={`room-type-${index}`} onChange={(e) => roomChange(e, index)} label="Otaq n??vl??ri" variant="outlined" />
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="second-division">
                            <TextField fullWidth id={`room-capacity-${index}`} onChange={(e) => capacityChange(e, index)} label="Otaq say??" variant="outlined" />
                        </div>
                    </div>
                    <div className="col-lg-2">
                        <div className="third-division">
                            {roomTypes.length !== 1 && (
                                <button
                                    type="button"
                                    onClick={() => roomRemove(index)}
                                    className="remove-btn"
                                >
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-2">
                        {roomTypes.length - 1 === index && roomTypes.length < 100 && (
                            <button
                                type="button"
                                onClick={roomAdd}
                                className="add-btn"
                            >
                                <i class="fa-solid fa-plus"></i> <span>??lav?? et</span>
                            </button>
                        )}
                    </div>
                </div>
            ))}

            <div className="nameAndPassword">
                <div className="row">
                    <div className="col-lg-6">
                        <TextField fullWidth id="outlined-basic" label="User name" className='mb-4' variant="outlined" inputRef={emailRef} />
                    </div>
                    <div className="col-lg-6">
                        <TextField fullWidth id="outlined-basic" label="Password" className='mb-4' variant="outlined" inputRef={passwordRef} />
                    </div>
                </div>
            </div>

            <button onClick={handleResetLocation}>Reset Location</button>
            <label>Latitute:</label><input type='text' value={location.lat} disabled />
            <label>Longitute:</label><input type='text' value={location.lng} disabled />
            <label>Zoom:</label><input type='text' value={zoom} disabled />

            <MapPicker defaultLocation={defaultLocation}
                zoom={zoom}
                mapTypeId="roadmap"
                style={{ height: '700px' }}
                onChangeLocation={handleChangeLocation}
                onChangeZoom={handleChangeZoom}
                apiKey='AIzaSyAkpCdayFL9fFwjqEG2DaSGYA0Vz73EVog'
            />

            <br />
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Menu</InputLabel>
                    <Select
                        className='select'
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={age}
                        label="Age"
                        onChange={changeMenuInput}
                    >
                        <MenuItem value={10} >Link</MenuItem>
                        <MenuItem value={20}>File</MenuItem>
                    </Select>
                    {
                        age == 10 ? <TextField fullWidth id="outlined-basic" label="Link" className='mb-4' variant="outlined" onChange={e => setMenu(e.target.value)} /> : ""
                    }
                    {
                        age == 20 ? <div className='fileUpload'>
                            <input
                                multiple
                                type="file"
                                onChange={(event) => { uploadMenuFile(event.target.files[0]) }}
                            /> <br /> <br />
                        </div>
                            : ""
                    }
                </FormControl>
            </Box>
            <button onClick={Save} className="submit">Elave et</button>

        </div>
    )
}

export default CreateRestaurants