import {
  useEffect,
  useState
} from 'react';
import './App.scss';
import Login from './components/Login/Login';
import SideBar from './components/SideBar/SideBar';
import {
  auth
} from './config/firebase';
import MyRouter from './router/MyRouter';
import Loading from '.././src/components/Loading/Loading'


function App() {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
      setLoading(false)
         if (userAuth != null) {
        console.log('userAuth', userAuth)
        const user = {
          uid: userAuth.uid,
          email: userAuth.email
        }
        setUser(user)
      } else {
        setUser(null)
      }
    })
    return unsubscribe
  }, [])


  return ( 
    <div id = "App" >
    {
      user ? <div className='container-fluid'>
      <div className="row">
        <div className="col-lg-3 p-0">
          <SideBar />
        </div>
        <div className="col-lg-9">
          <MyRouter /> 
        </div>
      </div>
    </div> : loading ? <Loading/> :  
      <Login/>
    }
    </div>
  );
}

export default App;