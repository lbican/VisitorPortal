import Croatia0 from '../assets/images/placeholder/croatia0.jpg';
import Croatia1 from '../assets/images/placeholder/croatia1.jpg';
import Croatia2 from '../assets/images/placeholder/croatia2.jpg';
import Croatia3 from '../assets/images/placeholder/croatia3.jpg';
import Croatia4 from '../assets/images/placeholder/croatia4.jpg';
import Croatia5 from '../assets/images/placeholder/croatia5.jpg';

const imageArr = [Croatia0, Croatia1, Croatia2, Croatia3, Croatia4, Croatia5];

const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * imageArr.length);
    return imageArr[randomIndex];
};

export default getRandomImage();
