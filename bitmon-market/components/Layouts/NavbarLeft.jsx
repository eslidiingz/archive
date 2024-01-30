import Link from "next/link";
import { useEffect, useState } from "react";
import ProfileModal from "../Modal/ProfileModal";
import WithdrawModal from "../Modal/WithdrawModal";
import { useWalletContext } from "/context/wallet";
import { shortWallet } from "/utils/misc";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { signIn, updateName } from "../../utils/api/user-api";
import { Spinner } from "react-bootstrap";
import { dAppChecked } from "../../utils/providers/connector";
import { ethers } from "ethers";

const NavbarLeft = () => {
  const { wallet } = useWalletContext();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState({ name: '', email: '' });

  const disconnectWallet = async () => {
    Swal.fire("Disconnect Wallet", "", "warning").then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Disconnect success fully", "", "success").then(() => {
          router.push('/marketplace');
        });

        setTimeout(() => {
          router.push('/marketplace');
        }, 3000);
      }
    });
  };

  const isMetaMaskConnected = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    return accounts.length > 0;
  };

  const initialize = async () => {
    if (await dAppChecked()) {
      await isMetaMaskConnected().then((connected) => {
        if (!connected) {
          window.ethereum.request({ method: 'eth_requestAccounts' });
        }
      });

      window.ethereum.on('accountsChanged', async (accounts) => {
        router.reload();
        // console.log('change account to', accounts);
        // await handleFetchProfile();
      });

      await handleFetchProfile();
    }
  };

  const handleFetchProfile = async () => {
    setLoading(true);
    let profileState = { name: '', email: '' };
    try {
      const response = await signIn(wallet);
      const name = response?.userData?.name || null;
      const accessToken = response?.accessToken || null;

      window.localStorage.setItem('ACC_TOKEN', accessToken);

      if (!name) {
        if (accessToken) {
          const userName = wallet?.slice?.(-10)?.toUpperCase?.();
          const responseUpdateName = await updateName(userName, accessToken);
          profileState.name = responseUpdateName?.name || '';
          profileState.email = '';
        }
      } else {
        profileState.name = name;
        profileState.email = '';
      }
    } catch {
      profileState.name = '';
      profileState.email = '';
    }

    setProfile(profileState);
    setLoading(false);
  };

  const handleOpenProfileModal = () => {
    setShowProfileModal(true);
  };

  const handleCloseWithdrawModal = () => {
    setModalShow(false);
  };

  const handleCloseProfileModal = (setProfileForm) => {
    if (typeof setProfileForm === 'function') {
      setProfileForm(profile);
    } else {
      setProfile(setProfileForm);
    }
    setShowProfileModal(false);
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <div className="sidebar bg-primary">
      <div className="row">
        <div className="col-12">
          <div className=" p-2 mx-auto text-center ">
            {/* <img
              src={"/assets/img/PicM031.webp"}
              alt=""
              className="m-auto user-wallet "
              onClick={() => setShowProfileModal(true)}
            /> */}
            <div className="my-2">
              {loading ? (
                <div className="text-center d-flex justify-content-center">
                  <span className="me-2 my-auto">Loading</span> <Spinner animation="border" role="status" />
                </div>
              ) : (
                <>
                  <h6 className="cursor-pointer profile__name" onClick={handleOpenProfileModal}>{profile.name}</h6>
                  <p>
                    {wallet ? shortWallet(wallet) : ""}
                    {/* <span className="px-2">
                      <img
                        src={"/assets/img/copy-code.webp"}
                        alt={`Profile Image - ${profile.name}`}
                        className="m-auto"
                      />
                    </span> */}
                  </p></>
              )}
            </div>
            <div className="py-1">
              <ul className="wallet-set-ul">
                <li className={`sidebar-left__item ${router.pathname === '/wallet' ? 'active' : ''}`}>
                  <div className="my-3 mx-lg-3 mx-3">
                    <span>
                      <img
                        src={"/assets/img/wallet.webp"}
                        alt=""
                        className="m-auto pe-lg-4 pe-2"
                      />
                    </span>
                    <Link href="/wallet">Wallet</Link>
                  </div>
                </li>
                <li className={`sidebar-left__item ${router.pathname.includes('/inventory') ? 'active' : ''}`}>
                  <div className="my-3 mx-lg-3 mx-3">
                    <span>
                      <img
                        src={"/assets/img/inven.webp"}
                        alt=""
                        className="m-auto pe-lg-4 pe-2"
                      />
                    </span>
                    <Link href="/inventory">Inventory</Link>
                  </div>
                </li>
                {/* <li>
                  <div className="my-3 mx-lg-3 mx-3">
                    <span>
                      <img
                        src={"/assets/img/disconnect.webp"}
                        alt=""
                        className="m-auto pe-lg-4 pe-2"
                      />
                    </span>
                    <Link href="#">
                      <a onClick={() => disconnectWallet()}>Disconnect</a>
                    </Link>
                  </div>
                </li> */}
                {/* <li>
                  <div className="my-3 mx-lg-0 mx-3">
                    <span>
                      <img
                        src={"/assets/img/staking.webp"}
                        alt=""
                        className="m-auto pe-lg-4 pe-2"
                      />
                    </span>
                    <Link href="/staking">Staking</Link>
                  </div>
                </li> */}
              </ul>
              {/* <button
                className="btn btn-img btn-violet  mx-auto"
                onClick={() => setModalShow(true)}
              >
                Withdraw
              </button> */}
            </div>
          </div>
        </div>
      </div>
      <WithdrawModal onClose={handleCloseWithdrawModal} show={modalShow} />
      <ProfileModal onClose={handleCloseProfileModal} show={showProfileModal} profile={profile} setProfile={setProfile} />
    </div>
  );
};

export default NavbarLeft;
