import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { getProfileArtisanById, getTokenFromCookie } from "../../../api/getProfile";
import { getArtisanSpecialitesById } from "../../../api/Specialite";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Import useParams to get the artisan_id from the URL

function Generale() {
    const { artisan_id } = useParams(); // Extract artisan_id from the URL
    const [specialites, setSpecialites] = useState([]);
    const [artisan, setArtisan] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const metiers =['peinture','cuisiniste', 'electricite generale',  'couture et retouche', 'Plomberie', 'Jardinage']

    // Function to fetch artisan profile
    const getUserProfile = async () => {
        try {
            const token = getTokenFromCookie(); // Get the token from cookies
            if (token) {
                const response = await getProfileArtisanById(artisan_id, {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                });
                setArtisan(response); // Set the artisan data
            } else {
                console.error("No token found");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    // Function to fetch artisan specialites
    const getSpecialites = async () => {
        try {
            const token = getTokenFromCookie(); // Get the token from cookies
            if (token) {
                const response = await getArtisanSpecialitesById(artisan_id,{
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                });
                setSpecialites(response); // Set the specialites data
            } else {
                console.error("No token found");
            }
        } catch (error) {
            console.error("Error fetching specialites:", error);
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        getUserProfile();
        getSpecialites();
    }, [artisan_id]); // Re-fetch when artisan_id changes

    if (loading) {
        return <p>Loading...</p>; // Show loading indicator
    }

    if (!artisan) {
        return <p>Artisan not found</p>; // Show error if artisan data is not found
    }

    return (
        <div
            style={{ backgroundColor: "rgba(249, 249, 249, 1)" }}
            className="bg-slate-300 flex-1 mt-0 p-6"
        >
            <div className="flex flex-row gap-4">
                <img
                    className="h-40 w-40 p-1 bg-gradient-to-r from-lightBlue via-lightGreen to-lightYellow rounded-full"
                    src={artisan?.image_file}
                    alt="Artisan-pfp"
                />
                <div className="flex flex-col ml-10">
                    <p className="font-semibold text-lg">Verifié</p>
                </div>
                <div className="flex flex-col mt-19 ml-60 flex-1">
                    <p className="font-semibold text-lg">Spécialité</p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        {specialites &&
                            specialites.map((item) => (
                                <div key={item.specialite_id}>
                                    <span className="bg-gray-300 p-1 rounded-md">
                                        {item.name}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <p className="font-semibold text-lg">{artisan?.user_name}</p>
                <p className="text-gray-600 text-lg">{metiers[artisan?.metier-1]}</p>
                <div className="flex flex-row gap-2 mt-2">
                    <FaLocationDot className="text-lightGreen text-iconSize" />
                    <p className="text-gray-600 text-center text-lg">
                        {artisan?.localisation}
                    </p>
                </div>
                <div className="flex flex-row gap-4 items-center mt-4">
                    <a
                        href="#"
                        className="flex items-center gap-2 px-4 py-2 rounded-md border-2 border-black bg-[#F1EBEB]"
                    >
                        <MdEmail className="text-lightGreen" />
                        <span className="text-lightGreen">Chattez avec moi</span>
                    </a>
                    <Link
                        to={`/user/rqdevis/${artisan_id}`}>
                    <a
                        href="#"
                        className="px-4 py-2 rounded-md border-2 border-black bg-lightGreen text-white"
                    >
                        Demander un devis
                    </a>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Generale;