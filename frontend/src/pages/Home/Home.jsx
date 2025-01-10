/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../utils/axiosInstance';
import TravelStoryCard from '../../components/Cards/TravelStoryCard';

const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [ allStories, setAllStories ] = useState([]);

  // Obtendo informações do usuário.
  const getUserInfo = async () => {
    try {

      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        // Definir informações do usuário caso existam dados.
        setUserInfo(response.data.user);
      } else {
        console.error("Dados do usuário ausentes ou no formato incorreto...");
      }
    } catch (error) {
      console.error("Erro ao obter informações do usuário:", error.message);
      if (error.response.status === 401) {
        // Limpar armazenamento local caso não seja autorizado...
        localStorage.clear();
        navigate("/login"); // Redirecionando para página de login...
      }
    }
  };
  
  // Obtendo todas as histórias.
  const getAllStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      if ( response.data && response.data.stories ) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("Ocorreu um erro inesperado. Tente novamente.");
    }

  }

  const handleEdit = (data) => {}

  const handleViewStory = (data) => {}

  const updateIsFavourite = async (storyData) => {}

  useEffect(() => {
    getAllStories();
    getUserInfo();
    return () => {
      
    };
  }, []);

  return (
    <>
      <Navbar userInfo={ userInfo } />

      <div className='container mx-auto py-10'>
        <div className='flex gap-7'>
            <div className='flex-1'>
              { allStories.length > 0 ? (
                <div className='grid grid-cols-2 gap-4'>
                  { allStories.map((item) => {
                    return (
                      <TravelStoryCard 
                        key={item._id}
                        imgUrl={item.imageUrl}
                        title={item.title}
                        story={item.story}
                        date={item.visitedDate}
                        visitedLocation={item.visitedLocation}
                        isFavourite={item.isFavourite}
                        onEdit={() => handleEdit(item)}
                        onClick={() => handleViewStory(item)}
                        onFavouriteClick={() => updateIsFavourite(item)}
                      />
                    );
                  })}
                </div>
              ) : (
                <> Cartão Vazio </>
              )}
            </div>

            <div className='w-[320px]'> </div>
        </div>
      </div>

    </>
  )
}

export default Home