import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import { updateName } from "../../utils/api/user-api";
import Swal from "sweetalert2";

const ProfileModal = (props) => {
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [formValidate, setFormValidate] = useState({ name: false, email: false });

  useEffect(() => {
    let mounted = true;

    initialize(mounted);

    return () => {
      mounted = false;
    };
  }, [props.profile.name, props.profile.email]);

  const initialize = async (mounted) => {
    if (mounted) {
      setProfileForm({ name: props.profile.name, email: props.profile.email });
    }
  };

  const handleChangeProfile = (e) => {
    let enteredProfileData = e.target.value?.trim() || "";
    if (e.target.name === "name") {
      enteredProfileData = enteredProfileData?.substring?.(0, 10)?.toUpperCase?.();
    } else {
      enteredProfileData = e.target.value?.trim();
    }

    setProfileForm((prevState) => ({
      ...prevState,
      [e.target.name]: enteredProfileData,
    }));
  };

  const validateProfileForm = async () => {
    let validated = true;
    let message = "";
    try {
      if (!profileForm.name.trim()) {
        validated = false;
        message = "Please enter name.";
        setFormValidate((prevState) => ({ ...prevState, name: true }));
      } else if (!profileForm.name.trim().length > 10) {
        validated = false;
        message = "Name must be 10 characters length.";
        setFormValidate((prevState) => ({ ...prevState, name: true }));
      }
    } catch {
      validated = false;
      message = "Please check your name.";
    }

    return { validated, message };
  };

  const handleSubmitUpdateProfile = async () => {
    let validated = true;
    try {
      let { validated: validateForm = true, message = "" } = await validateProfileForm();
      validated = validateForm;

      if (!validated) return Swal.fire("Warning", message, "warning");
      const accessToken = window.localStorage.getItem("ACC_TOKEN");
      if (accessToken) {
        const response = await updateName(profileForm.name, accessToken);
        if (response?._id) {
          Swal.fire("Success", "Updated successfully.", "success");
          props.onClose(profileForm);
          return;
        } else {
          Swal.fire("Warning", "Failed to update profile.", "warning");
        }
      }
    } catch {
      Swal.fire("Warning", "Failed to update profile.", "warning");
    }
  };

  return (
    <Modal
      show={props.show}
      onHide={() => props.onClose(setProfileForm)}
      className="profile-set"
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-modal mb-5">
        <h4>Profile</h4>
        <ul className="nav nav-tabs my-3">
          <li className="nav-item" role="presentation">
            <img src={"/assets/img/profile-01.webp"} alt="" className="m-auto p-1" />
          </li>
          <li className="nav-item" role="presentation">
            <img src={"/assets/img/profile-02.webp"} alt="" className="m-auto p-1" />
          </li>
          <li className="nav-item" role="presentation">
            <img src={"/assets/img/profile-03.webp"} alt="" className="m-auto p-1" />
          </li>
          <li className="nav-item" role="presentation">
            <img src={"/assets/img/profile-04.webp"} alt="" className="m-auto p-1" />
          </li>
        </ul>
        <label>Name</label>
        <input
          className={`form-control form-control-md input-set-profile ${formValidate.name ? "is-invalid" : ""}`}
          type="text"
          name="name"
          value={profileForm.name}
          onChange={handleChangeProfile}
        />
        <label>Email</label>
        <input className="form-control form-control-md input-set-profile" type="text" name="email" value={profileForm.email} onChange={handleChangeProfile} />
        <div className="position-close-profile">
          <button className="btn btn-img btn-green px-4" type="button" onClick={handleSubmitUpdateProfile}>
            OK
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileModal;
