import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion'


function CategoryNft() {
  const [userinfo, setUserInfo] = useState({
    languages: [],
    response: [],
  });

  const handleChange = (e) => {
    // Destructuring
    const { value, checked } = e.target;
    const { languages } = userinfo;

    console.log(`${value} is ${checked}`);

    // Case 1 : The user checks the box
    if (checked) {
      setUserInfo({
        languages: [...languages, value],
        response: [...languages, value],
      });
    }

    // Case 2  : The user unchecks the box
    else {
      setUserInfo({
        languages: languages.filter((e) => e !== value),
        response: languages.filter((e) => e !== value),
      });
    }
  };

  return (
    <>
      <Accordion defaultActiveKey={['0']} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Catagory</Accordion.Header>
          <div className='col-12 col-lg-12 d-flex c-pointer layout-catagory'>
            <p className="text-catagory-main"> <i className="fal fa-times mgr-8 "></i>Trading </p><p className="text-catagory-sub">14,800</p>
          </div>
          <Accordion.Body>
            <div className="row">
              <div className='col-xxl-2 col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 c-pointer'>
                <div className="layout-catagory-s">
                  <input className='form-check-input' type='checkbox' value='Trading' id='Trading' onChange={handleChange} />
                  <label className='form-check-label footer-font' htmlFor='Trading'>
                    <p className='text-catagory-main-s' >Trading</p>
                  </label>
                </div>
              </div>
              <div className='col-xxl-2 col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 c-pointer'>
                <div className="layout-catagory-s">
                  <input className='form-check-input' type='checkbox' value='Top' id='Top' onChange={handleChange} />
                  <label className='form-check-label footer-font' htmlFor='Top'>
                    <p className='text-catagory-main-s' >Top</p>
                  </label>
                </div>
              </div>
              <div className='col-xxl-2 col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 c-pointer'>
                <div className="layout-catagory-s">
                  <input className='form-check-input' type='checkbox' value='Art' id='Art' onChange={handleChange} />
                  <label className='form-check-label footer-font' htmlFor='Art'>
                    <p className='text-catagory-main-s' >Art</p>
                  </label>
                </div>
              </div>
              <div className='col-xxl-2 col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 c-pointer'>
                <div className="layout-catagory-s">
                  <input className='form-check-input' type='checkbox' value='Collectibles' id='Collectibles' onChange={handleChange} />
                  <label className='form-check-label footer-font' htmlFor='Collectibles'>
                    <p className='text-catagory-main-s' >Collectibles</p>
                  </label>
                </div>
              </div>
              <div className='col-xxl-2 col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 c-pointer'>
                <div className="layout-catagory-s">
                  <input className='form-check-input' type='checkbox' value='Domain Names' id='Domain Names' onChange={handleChange} />
                  <label className='form-check-label footer-font' htmlFor='Domain Names'>
                    <p className='text-catagory-main-s' >Domain Names</p>
                  </label>
                </div>
              </div>
              <div className='col-xxl-2 col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 c-pointer'>
                <div className="layout-catagory-s">
                  <input className='form-check-input' type='checkbox' value='Music' id='Music' onChange={handleChange} />
                  <label className='form-check-label footer-font' htmlFor='Music'>
                    <p className='text-catagory-main-s' >Music</p>
                  </label>
                </div>
              </div>
              <div className='col-xxl-2 col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 c-pointer'>
                <div className="layout-catagory-s">
                  <input className='form-check-input' type='checkbox' value='Photography' id='Photography' onChange={handleChange} />
                  <label className='form-check-label footer-font' htmlFor='Photography'>
                    <p className='text-catagory-main-s' >Photography</p>
                  </label>
                </div>
              </div>
              <div className='col-xxl-2 col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 c-pointer'>
                <div className="layout-catagory-s">
                  <input className='form-check-input' type='checkbox' value='Sports' id='Sports' onChange={handleChange} />
                  <label className='form-check-label footer-font' htmlFor='Sports'>
                    <p className='text-catagory-main-s' >Sports</p>
                  </label>
                </div>
              </div>
              <div className='col-xxl-2 col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 c-pointer'>
                <div className="layout-catagory-s">
                  <input className='form-check-input' type='checkbox' value='Teading Caeds' id='Teading Caeds' onChange={handleChange} />
                  <label className='form-check-label footer-font' htmlFor='Teading Caeds'>
                    <p className='text-catagory-main-s' >Teading Caeds</p>
                  </label>
                </div>
              </div>
              <div className='col-xxl-2 col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 c-pointer'>
                <div className="layout-catagory-s">
                  <input className='form-check-input' type='checkbox' value='Utifity' id='Utifity' onChange={handleChange} />
                  <label className='form-check-label footer-font' htmlFor='Utifity'>
                    <p className='text-catagory-main-s' >Utifity</p>
                  </label>
                </div>
              </div>
              <div className='col-xxl-2 col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 c-pointer'>
                <div className="layout-catagory-s">
                  <input className='form-check-input' type='checkbox' value='Vituat World' id='Vituat World' onChange={handleChange} />
                  <label className='form-check-label footer-font' htmlFor='Vituat World'>
                    <p className='text-catagory-main-s' >Vituat World</p>
                  </label>
                </div>
              </div>

            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}

export default CategoryNft;