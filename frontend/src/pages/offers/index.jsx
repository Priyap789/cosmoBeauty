import OfferImageSlider from "../../components/OfferImageSlider";

const OfferDetails = () => {
  const offer = {
    
    horizontalImages: [
      "/image/offer1.jpg",
      "/image/offer2.jpg",
      "/image/offer3.jpg",
      "/image/offer4.jpg",
    ],
  };

  return (
    <div className="max-w-100% mx-auto px-4 py-6">
        
      {/* Multiple Horizontal Images */}
          
      <OfferImageSlider images={offer.horizontalImages} />
           

      
    </div>
  );
};

export default OfferDetails;
