import React, { useState } from 'react';

function Category() {
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
      <div>
        <h4 className='footer-font' >Catagory</h4>
        <div>
          <div className='d-flex gap-2 flex-wrap my-3'>
            <h6 className='mb-0 bg-filler'> <i className="fal fa-times mgr-8 c-pointer"></i>Trading</h6>
          </div>
        </div>
      </div>
      <div className='row px-3'>
        <div className='col-6 col-md-3 col-lg-12 mb-lg-2 form-check'>
          <input className='form-check-input' type='checkbox' value='Trading' id='Trading' onChange={handleChange} />
          <label className='form-check-label footer-font' htmlFor='Trading'>
            <h6 className='mb-0' >Trading</h6>
          </label>
        </div>
        <div className='col-6 col-md-3 col-lg-12 mb-lg-2 form-check'>
          <input className='form-check-input' type='checkbox' value='Top' id='Top' onChange={handleChange} />
          <label className='form-check-label footer-font' htmlFor='Top'>
            <h6 className='mb-0' >Top</h6>
          </label>
        </div>
        <div className='col-6 col-md-3 col-lg-12 mb-lg-2 form-check'>
          <input className='form-check-input' type='checkbox' value='Art' id='Art' onChange={handleChange} />
          <label className='form-check-label footer-font' htmlFor='Art'>
            <h6 className='mb-0' >Art</h6>
          </label>
        </div>
        <div className='col-6 col-md-3 col-lg-12 mb-lg-2 form-check'>
          <input className='form-check-input' type='checkbox' value='Collectibles' id='Collectibles' onChange={handleChange} />
          <label className='form-check-label footer-font' htmlFor='Collectibles'>
            <h6 className='mb-0' >Collectibles</h6>
          </label>
        </div>
        <div className='col-6 col-md-3 col-lg-12 mb-lg-2 form-check'>
          <input className='form-check-input' type='checkbox' value='DomainNames' id='DomainNames' onChange={handleChange} />
          <label className='form-check-label footer-font' htmlFor='DomainNames'>
            <h6 className='mb-0' >Domain Names</h6>
          </label>
        </div>
        <div className='col-6 col-md-3 col-lg-12 mb-lg-2 form-check'>
          <input className='form-check-input' type='checkbox' value='Music' id='Music' onChange={handleChange} />
          <label className='form-check-label footer-font' htmlFor='Music'>
            <h6 className='mb-0' >Music</h6>
          </label>
        </div>
        <div className='col-6 col-md-3 col-lg-12 mb-lg-2 form-check'>
          <input className='form-check-input' type='checkbox' value='Photography' id='Photography' onChange={handleChange} />
          <label className='form-check-label footer-font' htmlFor='Photography'>
            <h6 className='mb-0' >Photography</h6>
          </label>
        </div>
        <div className='col-6 col-md-3 col-lg-12 mb-lg-2 form-check'>
          <input className='form-check-input' type='checkbox' value='Sports' id='Sports' onChange={handleChange} />
          <label className='form-check-label footer-font' htmlFor='Sports'>
            <h6 className='mb-0' >Sports</h6>
          </label>
        </div>
        <div className='col-6 col-md-3 col-lg-12 mb-lg-2 form-check'>
          <input className='form-check-input' type='checkbox' value='TeadingCaeds' id='TeadingCaeds' onChange={handleChange} />
          <label className='form-check-label footer-font' htmlFor='TeadingCaeds'>
            <h6 className='mb-0' >Teading Caeds</h6>
          </label>
        </div>
        <div className='col-6 col-md-3 col-lg-12 mb-lg-2 form-check'>
          <input className='form-check-input' type='checkbox' value='' id='Utifity' onChange={handleChange} />
          <label className='form-check-label footer-font' htmlFor='Utifity'>
            <h6 className='mb-0' >Utifity</h6>
          </label>
        </div>
        <div className='col-6 col-md-3 col-lg-12 mb-lg-2 form-check'>
          <input className='form-check-input' type='checkbox' value='' id='VituatWorld' onChange={handleChange} />
          <label className='form-check-label footer-font' htmlFor='VituatWorld'>
            <h6 className='mb-0' >Vituat World</h6>
          </label>
        </div>
      </div>
    </>
  );
}

export default Category;