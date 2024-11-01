import React from 'react';
import '../Style/Home.css'; // Uvezi CSS fajl
import '../Style/AddTaskForm.css';
import '../App.css';
import Notifications from '../components/Notifications';



function Home() {
  return (
    <div className="home-container">
      <h1> Dobrodošli u menadžer zadataka</h1>
      
               
                    {/* <img src={loggo} alt="Logo" className="navbar-logo-image" />
                    <h2>Enterijeri Ruža</h2> */}

<Notifications />
    </div>
    
  );
}

export default Home;

