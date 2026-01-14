import { useState } from 'react'
// Data imports will work once the script finishes
import Layout from './components/Layout'
import RegionSelector from './components/RegionSelector'
import DistrictSelector from './components/DistrictSelector'
import OutletList from './components/OutletList'
import ProductDisplay from './components/ProductDisplay'
import LandingPage from './components/LandingPage'

import regionsData from './data/regions_final.json'
import outletsData from './data/outlets_final.json'



function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [step, setStep] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedOutlet, setSelectedOutlet] = useState(null);

  const handleEnter = () => {
    setShowLanding(false);
  };

  const handleSelectRegion = (region) => {
    setSelectedRegion(region);
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDistrict = (district) => {
    setSelectedDistrict(district);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOutlet = (outlet) => {
    setSelectedOutlet(outlet);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (step === 1) {
      setSelectedRegion(null);
      setStep(0);
    } else if (step === 2) {
      setSelectedDistrict(null);
      setStep(1);
    } else if (step === 3) {
      setSelectedOutlet(null);
      setStep(2);
    }
  };

  const handleHome = () => {
    setShowLanding(true);
    setStep(0);
    setSelectedRegion(null);
    setSelectedDistrict(null);
    setSelectedOutlet(null);
  }

  if (showLanding) {
    return <LandingPage onEnter={handleEnter} />;
  }

  let content;
  let pageTitle = "";

  switch (step) {
    case 0:
      content = <RegionSelector
        regions={regionsData}
        outlets={outletsData}
        onSelectRegion={handleSelectRegion}
        onSelectOutlet={handleSelectOutlet}
      />;
      pageTitle = "Select a Region";
      break;
    case 1:
      content = (
        <DistrictSelector
          region={selectedRegion}
          outlets={outletsData}
          onSelectDistrict={handleSelectDistrict}
        />
      );
      pageTitle = `${selectedRegion?.name} Districts`;
      break;
    case 2:
      content = (
        <OutletList
          regionId={selectedRegion?.name} // Passing name to match outlet data
          district={selectedDistrict}
          onSelectOutlet={handleSelectOutlet}
        />
      );
      pageTitle = `Outlets in ${selectedDistrict}`;
      break;
    case 3:
      content = <ProductDisplay outlet={selectedOutlet} />;
      pageTitle = "Outlet Products";
      break;
    default:
      content = <div>Error</div>;
  }

  return (
    <Layout
      contentTitle={pageTitle}
      onBack={step > 0 ? handleBack : handleHome}
      onHome={handleHome}
    >
      {content}
    </Layout>
  )
}

export default App
