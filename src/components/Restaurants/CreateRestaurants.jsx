import { Box, FormControl, FormLabel, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './restaurants.scss'
import ImageUploading from 'react-images-uploading';
import MapPicker from 'react-google-map-picker';
import { collection, addDoc, GeoPoint } from "firebase/firestore";
import { db } from "../../config/firebase";
import { storage } from "../../config/firebase"
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage"
import { v4 } from 'uuid';
import Swal from 'sweetalert2'

const DefaultLocation = { lat: 40.4093, lng: 49.8671 };
const DefaultZoom = 10;

const CreateRestaurants = () => {
    const [restaurantName, setRestaurantName] = useState("")
    const [address, setAddress] = useState("")
    const [avgPrice, setAvaragePrice] = useState("")
    const [mainCuisine, setMainCuisine] = useState("")
    const [workingStartsAt, setWorkingStartsAt] = useState(new Date())
    const [endTime, setEndTime] = useState(new Date())
    const [reservStartTime, setReservStartTime] = useState(new Date())
    const [reservEndTime, setReservEndTime] = useState(new Date())
    const [socialNetworkAccount, setSocialNetworkAccount] = useState("")
    const [smokingRooms, setSmokingRooms] = useState("")
    const [nonSmokingRooms, setNonSmokingRooms] = useState("")
    const [description, setDescription] = useState("")
    const [bookingAvailable, setBookingAvailable] = useState(true)
    const [maxAllowedGuests, setMaxAllowedGuests] = useState("")
    const [username, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
    const [lat, setLat] = useState(defaultLocation.lat)
    const [lng, setLng] = useState(defaultLocation.lng)
    const [phoneNumbers, setPhoneNumbers] = useState([{ mobile: "" }]);
    const [roomTypes, setRoomTypes] = useState([{ room: "" }]);
    const [images, setImages] = useState([]);
    const [menu, setMenu] = useState("");
    const [photos, setPhotos] = React.useState([]);
    const [singleImages, setSingleImages] = React.useState([]);
    const [location, setLocation] = useState(defaultLocation);
    const [zoom, setZoom] = useState(DefaultZoom);
    const [age, setAge] = React.useState('');
    const maxNumber = 69;
    const [menuUrls, setMenuUrls] = useState([]);
    const [thumbImage, setThumbImage] = useState("")

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
                setMenuUrls(() => [url]);
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

    useEffect(() => {
        listAll(menuListRef).then((response) => {
            response.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    setMenuUrls(() => [url]);
                });
            });
        });
    }, []);

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

    const roomChange = (e, index) => {
        const { value } = e.target;
        const list = [...roomTypes];
        list[index] = value;
        setRoomTypes(list);
    };

    const roomRemove = (index) => {
        const list = [...roomTypes];
        list.splice(index, 1);
        setRoomTypes(list);
    };

    const roomAdd = () => {
        setRoomTypes([...roomTypes, ""]);
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

    const Save = async () => {
        try {
            console.log(images);
            const docRef = await addDoc(collection(db, "restaurantes"), {
                name: restaurantName,
                phoneNumbers: phoneNumbers,
                address: address,
                avgPrice: parseFloat(avgPrice),
                mainCuisine: mainCuisine,
                workingStartsAt: workingStartsAt,
                workingEndsAt: endTime,
                bookingStartsAt: reservStartTime,
                bookingEndsAt: reservEndTime,
                socialNetworkAccount: socialNetworkAccount,
                smokingRooms: smokingRooms,
                nonSmokingRooms: nonSmokingRooms,
                description: description,
                bookingAvailable: bookingAvailable,
                maxAllowedGuests: parseFloat(maxAllowedGuests),
                username: username,
                password: password,
                menu: menu,
                location: new GeoPoint(lat, lng),
                roomTypes: roomTypes,
                thumbImage: thumbImage,
                images: images,
                menuUrls: menuUrls
            });

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Məlumat əlavə olundu',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (err) {
            console.log(err)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Xəta baş verdi',
            })
        }
    }
    Date.prototype.addHours = function (h) {
        this.setHours(this.getHours() + h);
        return this;
    }


    return (
        <div id='CreateRestaurants'>
            <TextField fullWidth id="outlined-basic" label="Restoranın adı" className='mb-4' variant="outlined" onChange={e => setRestaurantName(e.target.value)} />
            {phoneNumbers.map((singleService, index) => (

                <div key={index} className="row align-items-center justify-content-center">
                    <div className="col-lg-8">
                        <div className="first-division">
                            <TextField fullWidth id="outlined-basic" onChange={(e) => phoneNumberChange(e, index)} label="Mobil nömrə" variant="outlined" />
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
                                <i class="fa-solid fa-plus"></i> <span>Əlavə et</span>
                            </button>
                        )}
                    </div>
                </div>
            ))}
            <TextField fullWidth id="outlined-basic" label="Adres" className='mb-4' variant="outlined" onChange={e => setAddress(e.target.value)} />
            <TextField fullWidth id="outlined-basic" label="Orta qiymət" className='mb-4' variant="outlined" onChange={e => setAvaragePrice(e.target.value)} />
            <TextField fullWidth id="outlined-basic" label="Əsas mətbəx" className='mb-4' variant="outlined" onChange={e => setMainCuisine(e.target.value)} />
            <div className="workTime">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <p>İş saatları</p>
                        <TextField
                            id="time"
                            label="Başlama saatı"
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
                            label="Bitmə saatı"
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
                    <div className="col-lg-6">
                        <p>Rezerv saatları</p>
                        <TextField
                            id="time"
                            label="Başlama saatı"
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
                            label="Bitmə saatı"
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
            </div>

            <TextField fullWidth id="outlined-basic" label="Sosial şəbəkə hesabı" className='mb-4' variant="outlined" onChange={e => setSocialNetworkAccount(e.target.value)} />
            <div className="cigarettesTrueFalse">
                <div className="row">
                    <div className="col-lg-6">
                        <TextField fullWidth id="outlined-basic" label="Siqaret çəkilən otaqlar" className='mb-4' type="number"
                            onChange={(event) => (
                                event.target.value < 0
                                    ? (event.target.value = 0)
                                    : event.target.value,
                                setSmokingRooms(event.target.value)
                            )} variant="outlined" />
                    </div>
                    <div className="col-lg-6">
                        <TextField fullWidth id="outlined-basic"
                            onChange={(event) => (
                                event.target.value < 0
                                    ? (event.target.value = 0)
                                    : event.target.value,
                                setNonSmokingRooms(event.target.value)
                            )}
                            label="Siqaret çəkilməyən otaqlar" className='mb-4' type="number"
                            variant="outlined" />
                    </div>
                </div>
            </div>
            <TextField
                id="outlined-multiline-static"
                label="Təsvir"
                multiline
                rows={4}
                fullWidth
                onChange={e => setDescription(e.target.value)}
            />
            <div className="row align-items-center">
                <div className="col-lg-6">
                    <span>Rezervasiya mövcuddur</span>
                </div>
                <div className="col-lg-6 d-flex justify-content-end">
                    <FormLabel component="legend">
                        <Switch defaultChecked onChange={(e) => (
                            setBookingAvailable(e.target.checked)
                        )} />
                    </FormLabel>
                </div>

            </div>
            <div className="profilePhoto">
                <p>Profil şəkli</p>
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
                <p>Səkillər</p>

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
                {/* <ImageUploading
          multiple
          value={photos}
          onChange={uploadImages}
          maxNumber={maxNumber}
          dataURLKey="data_url"
        >
          {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps,
          }) => (
            <div className="upload__image-wrapper">
              <button
                style={isDragging ? { color: 'red' } : undefined}
                onClick={onImageUpload}
                {...dragProps}
                className="uploadSinglePhoto"
              >
                Click or Drop here
              </button>
              &nbsp;
              {images.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image} className="smallphoto" alt="" width="200" />
                </div>
              ))}

              {imageList.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image['data_url']} className="smallphoto" alt="" width="200" />
                </div>
              ))}
            </div>
          )}
        </ImageUploading> */}


            </div>
            <TextField fullWidth id="outlined-basic" label="İcazə verilən ən çox qonaq sayı" className='mb-4 mt-4' type="number"
                onChange={(event) => (
                    event.target.value < 0
                        ? (event.target.value = 0)
                        : event.target.value,
                    setMaxAllowedGuests(event.target.value)
                )} variant="outlined" />
            {roomTypes.map((singleRoom, index) => (
                <div key={index} className="row align-items-center justify-content-center">
                    <div className="col-lg-8">
                        <div className="first-division">
                            <TextField fullWidth id="outlined-basic" onChange={(e) => roomChange(e, index)} label="Otaq növləri" variant="outlined" />
                        </div>
                    </div>
                    <div className="col-lg-2">
                        <div className="second-division">
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
                                <i class="fa-solid fa-plus"></i> <span>Əlavə et</span>
                            </button>
                        )}
                    </div>
                </div>
            ))}
            <div className="nameAndPassword">
                <div className="row">
                    <div className="col-lg-6">
                        <TextField fullWidth id="outlined-basic" label="User name" className='mb-4' variant="outlined" onChange={(e) => setUserName(e.target.value)} />
                    </div>
                    <div className="col-lg-6">
                        <TextField fullWidth id="outlined-basic" label="Password" className='mb-4' variant="outlined" onChange={(e) => setPassword(e.target.value)} />
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