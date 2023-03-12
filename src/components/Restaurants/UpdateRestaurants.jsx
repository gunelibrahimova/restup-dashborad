import { Box, FormControl, FormLabel, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Switch, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './restaurants.scss'
import ImageUploading from 'react-images-uploading';
import MapPicker from 'react-google-map-picker';
import { collection, updateDoc, GeoPoint, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { storage } from "../../config/firebase"
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage"
import { v4 } from 'uuid';
import Swal from 'sweetalert2'
import { useLocation } from 'react-router-dom';

const DefaultLocation = { lat: 40.4093, lng: 49.8671 };
const DefaultZoom = 10;


const UpdateRestaurants = () => {

  const [restaurantName, setRestaurantName] = useState("")
  const [address, setAddress] = useState("")
  const [avgPrice, setAvaragePrice] = useState("")
  const [mainCuisine, setMainCuisine] = useState("")
  const [category, setCategory] = useState("")
  const [workingStartsAt, setWorkingStartsAt] = useState(new Date())
  const [workingEndsAt, setWorkingEndsAt] = useState(new Date())
  const [bookingStartsAt, setBookingStartsAt] = useState(new Date())
  const [bookingEndsAt, setBookingEndsAt] = useState(new Date())
  const [socialNetworkAccount, setSocialNetworkAccount] = useState("")
  const [description, setDescription] = useState("")
  const [bookingAvailable, setBookingAvailable] = useState(true)
  const [maxAllowedGuests, setMaxAllowedGuests] = useState("")
  const [lat, setLat] = useState(DefaultLocation.lat)
  const [lng, setLng] = useState(DefaultLocation.lng)
  const [phoneNumbers, setPhoneNumbers] = useState([{ mobile: "" }]);
  const [roomTypes, setRoomTypes] = useState([
    { room: "", capacity: "" },
  ]);
  const [menu, setMenu] = useState("");
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(DefaultLocation);
  const [zoom, setZoom] = useState(DefaultZoom);
  const [age, setAge] = React.useState('');
  const [thumbImage, setThumbImage] = useState("")


  const locationn = useLocation()

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
        setMenu(url)
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

  const roomChange = (e, index) => {
    // const { value } = e.target;
    const list = [...roomTypes];
    list[index].room = e.target.value;
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

  function handleChangeLocation(lat, lng) {
    setLocation({ lat: lat, lng: lng });
    setLat(lat);
    setLng(lng)
  }

  function handleChangeZoom(newZoom) {
    setZoom(newZoom);
  }

  function handleResetLocation() {
    setLocation({ ...DefaultLocation });
    setZoom(DefaultZoom);
  }

  const changeMenuInput = (event) => {
    setAge(event.target.value)
  };

  const addData = async () => {
    const docRef = doc(db, "restaurantes", locationn.state.id);
    const docSnap = await getDoc(docRef)
    const data = docSnap.data()

    console.log(data.roomTypes);

    // const roomTypesData = roomTypes.map(rooms => {
    //   return {
    //     room: rooms.room,
    //     capacity: rooms.capacity
    //   };
    // });


    const newFields = {
      address: data.address,
      name: data.name,
      phoneNumbers: data.phoneNumbers,
      avgPrice: data.avgPrice,
      mainCuisine: data.mainCuisine,
      category: data.category,
      workingStartsAt: data.workingStartsAt,
      workingEndsAt: data.workingEndsAt,
      bookingStartsAt: data.bookingStartsAt,
      bookingEndsAt: data.bookingEndsAt,
      socialNetworkAccount: data.socialNetworkAccount,
      description: data.description,
      bookingAvailable: data.bookingAvailable,
      maxAllowedGuests: parseFloat(data.maxAllowedGuests),
      menu: data.menu,
      location: new GeoPoint(data.location.latitude, data.location.longitude),
      roomTypes: data.roomTypes,
      thumbImage: data.thumbImage,
      images: data.images,
    };

    setRestaurantName(newFields.name)
    setAddress(newFields.address)
    setAvaragePrice(newFields.avgPrice)
    setMainCuisine(newFields.mainCuisine)
    setCategory(newFields.category)
    setWorkingStartsAt(newFields.workingStartsAt.toDate())
    setWorkingEndsAt(newFields.workingEndsAt.toDate())
    setBookingStartsAt(newFields.bookingStartsAt.toDate())
    setBookingEndsAt(newFields.bookingEndsAt.toDate())
    setSocialNetworkAccount(newFields.socialNetworkAccount)
    setDescription(newFields.description)
    setBookingAvailable(newFields.bookingAvailable)
    setMaxAllowedGuests(newFields.maxAllowedGuests)
    setMenu(newFields.menu)
    setPhoneNumbers(newFields.phoneNumbers)
    setRoomTypes(newFields.roomTypes)
    setThumbImage(newFields.thumbImage)
    setImages(newFields.images)
    setLat(newFields.location.latitude)
    setLng(newFields.location.longitude)
    setLocation({ lat: newFields.location.latitude, lng: newFields.location.longitude });
  }

  const updateUser = async () => {
    try {
      const docRef = doc(db, "restaurantes", locationn.state.id);
      const docSnap = await getDoc(docRef)
      const data = docSnap.data()

      const newFields = {
        address: address,
        name: restaurantName,
        phoneNumbers: phoneNumbers,
        avgPrice: avgPrice,
        mainCuisine: mainCuisine,
        category: category,
        workingStartsAt: workingStartsAt,
        workingEndsAt: workingEndsAt,
        bookingStartsAt: bookingStartsAt,
        bookingEndsAt: bookingEndsAt,
        socialNetworkAccount: socialNetworkAccount,
        description: description,
        bookingAvailable: bookingAvailable,
        maxAllowedGuests: parseFloat(maxAllowedGuests),
        menu: menu,
        location: new GeoPoint(location.lat, location.lng),
        roomTypes: roomTypes,
        thumbImage: thumbImage,
        images: images,
      };

      await updateDoc(docRef, newFields)
        .then(docRef => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Məlumat yeniləndi',
            showConfirmButton: false,
            timer: 1500
          })
        })
    }
    catch (err) {
      console.log(err)
    }
  };


  useEffect(() => {
    addData()
  }, [])

  function fmt(date, format = 'YYYY-MM-DDThh:mm:ss') {
    const pad2 = (n) => n.toString().padStart(2, '0');
    const map = {
      YYYY: date.getFullYear(),
      MM: pad2(date.getMonth() + 1),
      DD: pad2(date.getDate()),
      hh: pad2(date.getHours()),
      mm: pad2(date.getMinutes()),
      ss: pad2(date.getSeconds()),
    };

    return Object.entries(map).reduce((prev, entry) => prev.replace(...entry), format);
  }

  Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
  }


  return (
    <div id='UpdateRestaurants'>
      <TextField fullWidth id="outlined-basic" label="Restoranın adı" className='mb-4' value={restaurantName} variant="outlined" onChange={e => setRestaurantName(e.target.value)} />
      {phoneNumbers.map((singleService, index) => (

        <div key={index} className="row align-items-center justify-content-center">
          <div className="col-lg-8 col-10">
            <div className="first-division">
              <TextField fullWidth id="outlined-basic" value={phoneNumbers[index]} onChange={(e) => phoneNumberChange(e, index)} label="Mobil nömrə" variant="outlined" />
            </div>
          </div>
          <div className="col-lg-2 col-2">
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
      <TextField fullWidth id="outlined-basic" label="Adres" className='mb-4' variant="outlined" onChange={e => setAddress(e.target.value)} value={address} />
      {/* <TextField fullWidth id="outlined-basic" label="Orta qiymət" value={avgPrice} className='mb-4' variant="outlined" onChange={e => setAvaragePrice(e.target.value)} /> */}
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Orta qiymət</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          fullWidth label="Orta qiymət" className='mb-4' variant="outlined" value={avgPrice} onChange={e => setAvaragePrice(e.target.value)}
        >
          <MenuItem value={"Cheap"}>Ucuz</MenuItem>
          <MenuItem value={"Medium"}>Orta</MenuItem>
          <MenuItem value={"Expensive"}>Bahalı</MenuItem>
        </Select>
      </FormControl>
      <TextField fullWidth id="outlined-basic" label="Əsas mətbəx" value={mainCuisine} className='mb-4' variant="outlined" onChange={e => setMainCuisine(e.target.value)} />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Kateqoriya</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={category}
          fullWidth label="Əsas mətbəx" className='mb-4' variant="outlined" onChange={e => setCategory(e.target.value)}
        >
          <MenuItem value={"Avropa mətbəxi"}>Avropa mətbəxi</MenuItem>
          <MenuItem value={"Slavyan mətbəxi"}>Slavyan mətbəxi</MenuItem>
          <MenuItem value={"Fransız mətbəxi"}>Fransız mətbəxi</MenuItem>
          <MenuItem value={"İtalyan mətbəxi"}>İtalyan mətbəxi</MenuItem>
          <MenuItem value={"Yapon mətbəxi"}>Yapon mətbəxi</MenuItem>
          <MenuItem value={"Coffee and snacks"}>Coffee and snacks</MenuItem>
          <MenuItem value={"Hind mətbəxi"}>Hind mətbəxi</MenuItem>
          <MenuItem value={"Milli mətbəx"}>Milli mətbəx</MenuItem>
          <MenuItem value={"Meksika mətbəxi"}>Meksika mətbəxi</MenuItem>
        </Select>
      </FormControl>
      <div className="workTime">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <p>İş saatları</p>
            <TextField
              id="time"
              label="Başlama saatı"
              type="time"
              className='startTime'
              value={fmt(workingStartsAt, 'hh:mm')}
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
              value={fmt(workingEndsAt, 'hh:mm')}
              onChange={(e) => (
                setWorkingEndsAt(e.target.valueAsDate.addHours(-4))
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

      <TextField fullWidth id="outlined-basic" label="Sosial şəbəkə hesabı" className='mb-4' variant="outlined" value={socialNetworkAccount} onChange={e => setSocialNetworkAccount(e.target.value)} />
      <TextField
        id="outlined-multiline-static"
        label="Təsvir"
        multiline
        value={description}
        rows={4}
        fullWidth
        onChange={e => setDescription(e.target.value)}
      />

      <div className="row align-items-center">
        <div className="col-lg-6">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <span>Rezervasiya mövcuddur</span>
            </div>
            <div className="col-lg-6 d-flex justify-content-end">
              <FormLabel component="legend">
                <Switch checked={bookingAvailable} onChange={(e) => (
                  setBookingAvailable(e.target.checked)
                )} />
              </FormLabel>
            </div>
          </div>
        </div>
        <div className={bookingAvailable ? "reserve col-lg-6" : "display"}>
          <p>Rezerv saatları</p>
          <TextField
            id="time"
            label="Başlama saatı"
            type="time"
            value={fmt(bookingStartsAt, 'hh:mm')}
            className='startTime'
            onChange={(e) => (
              setBookingStartsAt(e.target.valueAsDate.addHours(-4))
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
            value={fmt(bookingEndsAt, 'hh:mm')}
            onChange={(e) => (
              setBookingEndsAt(e.target.valueAsDate.addHours(-4))
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
        <img src={thumbImage} className="smallphoto" alt="" />
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
      </div>
      <TextField fullWidth id="outlined-basic" label="İcazə verilən ən çox qonaq sayı" value={maxAllowedGuests} className='mb-4 mt-4' type="number"
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
              <TextField fullWidth id="outlined-basic" value={roomTypes[index].room} onChange={(e) => roomChange(e, index)} label="Otaq növləri" variant="outlined" />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="second-division">
              <TextField fullWidth id={`room-capacity-${index}`} value={roomTypes[index].capacity} onChange={(e) => capacityChange(e, index)} label="Otaq sayı" variant="outlined" />
            </div>
          </div>
          <div className="col-lg-2 ">
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

      <button onClick={handleResetLocation}>Reset Location</button>
      <label>Latitute:</label><input type='text' value={location.lat} disabled />
      <label>Longitute:</label><input type='text' value={location.lng} disabled />
      <label>Zoom:</label><input type='text' value={zoom} disabled />

      <MapPicker
        defaultLocation={location}
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
            age == 10 ? <TextField fullWidth id="outlined-basic" label="Link" className='mb-4' variant="outlined" value={menu} onChange={e => setMenu(e.target.value)} /> : ""
          }
          {
            age == 20 ? <div className='fileUpload'>
              <input
                type="file"
                onChange={(event) => { uploadMenuFile(event.target.files[0]) }}
              /> <br /> <br />
            </div>
              : ""
          }
        </FormControl>
      </Box>
      <button onClick={updateUser} className="submit">Düzəliş et</button>
    </div>
  )
}

export default UpdateRestaurants