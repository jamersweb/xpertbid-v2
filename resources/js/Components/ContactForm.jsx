import React, { useState } from "react";
import { useForm } from '@inertiajs/react';
import SuccessPopup from "@/Components/SuccessPopup";
import ErrorPopup from "@/Components/ErrorPopup";

const ContactForm = () => {
       const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
              name: "",
              email: "",
              subject: "",
              message: "",
       });

       const [showSuccessPopup, setShowSuccessPopup] = useState(false);
       const [successPopupMessage, setSuccessPopupMessage] = useState("");
       const [successPopupSubMessage, setSuccessPopupSubMessage] = useState("");

       const [showErrorPopup, setShowErrorPopup] = useState(false);
       const [errorPopupMessage, setErrorPopupMessage] = useState("");
       const [errorPopupSubMessage, setErrorPopupSubMessage] = useState("");

       const handleChange = (e) => {
              setData(e.target.name, e.target.value);
              clearErrors(e.target.name);
       };

       const handleSubmit = (e) => {
              e.preventDefault();
              setShowSuccessPopup(false);
              setShowErrorPopup(false);

              post(route('contact.store'), {
                     preserveScroll: true,
                     onSuccess: () => {
                            setSuccessPopupMessage("Message sent successfully!");
                            setSuccessPopupSubMessage("We will get back to you shortly.");
                            setShowSuccessPopup(true);
                            reset();
                     },
                     onError: (errors) => {
                            setErrorPopupMessage("Validation Error");
                            setErrorPopupSubMessage(Object.values(errors).join(" "));
                            setShowErrorPopup(true);
                     },
              });
       };

       return (
              <div className="container py-4">
                     <div className="row">
                            <div className="col-md-6 contact-section text-gray-900">
                                   <h2 className="main-heading-about mb-4 text-gray-900">Contact Us</h2>
                                   <div className="social-icons mb-4">
                                          <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/xpert_bid?igsh=NWFqcmh5eTgwOWpq">
                                                 {/* Instagram SVG */}
                                                 <svg xmlns="http://www.w3.org/2000/svg" width="67" height="67" viewBox="0 0 67 67" fill="none">
                                                        <path d="M36.3701 5.5835C39.5107 5.59187 41.1048 5.60862 42.4811 5.6477L43.0227 5.66725C43.648 5.68958 44.2649 5.7175 45.0103 5.751C47.9807 5.89058 50.0074 6.35958 51.7857 7.04912C53.6282 7.7582 55.1804 8.71854 56.7325 10.2679C58.1526 11.663 59.2511 13.3512 59.9513 15.2147C60.6409 16.993 61.1099 19.0198 61.2495 21.9929C61.283 22.7355 61.3109 23.3525 61.3332 23.9806L61.3499 24.5222C61.3918 25.8957 61.4086 27.4897 61.4142 30.6303L61.4169 32.7129V36.37C61.4237 38.4062 61.4023 40.4425 61.3527 42.4782L61.336 43.0197C61.3137 43.6479 61.2857 44.2648 61.2522 45.0074C61.1127 47.9805 60.6381 50.0045 59.9513 51.7856C59.2511 53.6491 58.1526 55.3373 56.7325 56.7324C55.3374 58.1525 53.6492 59.251 51.7857 59.9512C50.0074 60.6407 47.9807 61.1097 45.0103 61.2493L43.0227 61.3331L42.4811 61.3498C41.1048 61.3889 39.5107 61.4085 36.3701 61.414L34.2875 61.4168H30.6332C28.5961 61.424 26.5589 61.4026 24.5223 61.3526L23.9807 61.3359C23.318 61.3108 22.6554 61.2819 21.993 61.2493C19.0227 61.1097 16.996 60.6407 15.2149 59.9512C13.3524 59.2507 11.6651 58.1522 10.2708 56.7324C8.84972 55.3376 7.75026 53.6493 7.04924 51.7856C6.3597 50.0073 5.8907 47.9805 5.75112 45.0074L5.66737 43.0197L5.65341 42.4782C5.60195 40.4425 5.57868 38.4063 5.58362 36.37V30.6303C5.57589 28.5941 5.59637 26.5578 5.64504 24.5222L5.66458 23.9806C5.68691 23.3525 5.71483 22.7355 5.74833 21.9929C5.88791 19.0198 6.35691 16.9958 7.04645 15.2147C7.7491 13.3505 8.85049 11.6622 10.2736 10.2679C11.6671 8.84849 13.3534 7.75003 15.2149 7.04912C16.996 6.35958 19.0199 5.89058 21.993 5.751C22.7356 5.7175 23.3554 5.68958 23.9807 5.66725L24.5223 5.6505C26.5579 5.6009 28.5942 5.57949 30.6305 5.58629L36.3701 5.5835ZM33.5003 19.5418C29.7983 19.5418 26.2479 21.0124 23.6303 23.6301C21.0126 26.2478 19.542 29.7982 19.542 33.5002C19.542 37.2021 21.0126 40.7525 23.6303 43.3702C26.2479 45.9879 29.7983 47.4585 33.5003 47.4585C37.2023 47.4585 40.7526 45.9879 43.3703 43.3702C45.988 40.7525 47.4586 37.2021 47.4586 33.5002C47.4586 29.7982 45.988 26.2478 43.3703 23.6301C40.7526 21.0124 37.2023 19.5418 33.5003 19.5418ZM33.5003 25.1252C34.6001 25.125 35.6892 25.3414 36.7054 25.7621C37.7215 26.1829 38.6449 26.7996 39.4227 27.5772C40.2005 28.3547 40.8176 29.2779 41.2386 30.2939C41.6597 31.3099 41.8765 32.3989 41.8767 33.4988C41.8769 34.5986 41.6604 35.6877 41.2397 36.7038C40.819 37.72 40.2022 38.6434 39.4247 39.4212C38.6471 40.199 37.724 40.8161 36.7079 41.2371C35.6919 41.6582 34.6029 41.875 33.5031 41.8752C31.2819 41.8752 29.1517 40.9928 27.5811 39.4222C26.0104 37.8516 25.1281 35.7214 25.1281 33.5002C25.1281 31.279 26.0104 29.1488 27.5811 27.5781C29.1517 26.0075 31.2819 25.1252 33.5031 25.1252M48.1593 15.3543C47.2338 15.3543 46.3462 15.722 45.6918 16.3764C45.0374 17.0308 44.6697 17.9184 44.6697 18.8439C44.6697 19.7694 45.0374 20.657 45.6918 21.3114C46.3462 21.9658 47.2338 22.3335 48.1593 22.3335C49.0848 22.3335 49.9724 21.9658 50.6268 21.3114C51.2813 20.657 51.6489 19.7694 51.6489 18.8439C51.6489 17.9184 51.2813 17.0308 50.6268 16.3764C49.9724 15.722 49.0848 15.3543 48.1593 15.3543Z" fill="#43ACE9" />
                                                 </svg>
                                          </a>
                                          <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/company/xpertbid/">
                                                 {/* LinkedIn SVG */}
                                                 <svg xmlns="http://www.w3.org/2000/svg" width="51" height="51" viewBox="0 0 51 51" fill="none">
                                                        <path d="M45.0417 0.375C46.5225 0.375 47.9426 0.963242 48.9897 2.01032C50.0368 3.0574 50.625 4.47754 50.625 5.95833V45.0417C50.625 46.5225 50.0368 47.9426 48.9897 48.9897C47.9426 50.0368 46.5225 50.625 45.0417 50.625H5.95833C4.47754 50.625 3.0574 50.0368 2.01032 48.9897C0.963242 47.9426 0.375 46.5225 0.375 45.0417V5.95833C0.375 4.47754 0.963242 3.0574 2.01032 2.01032C3.0574 0.963242 4.47754 0.375 5.95833 0.375H45.0417ZM43.6458 43.6458V28.85C43.6458 26.4363 42.687 24.1215 40.9803 22.4147C39.2735 20.708 36.9587 19.7492 34.545 19.7492C32.1721 19.7492 29.4083 21.2008 28.0683 23.3783V20.2796H20.2796V43.6458H28.0683V29.8829C28.0683 27.7333 29.7992 25.9746 31.9488 25.9746C32.9853 25.9746 33.9794 26.3864 34.7124 27.1193C35.4453 27.8523 35.8571 28.8464 35.8571 29.8829V43.6458H43.6458ZM11.2067 15.8967C12.4505 15.8967 13.6435 15.4025 14.523 14.523C15.4025 13.6435 15.8967 12.4505 15.8967 11.2067C15.8967 8.61042 13.8029 6.48875 11.2067 6.48875C9.9554 6.48875 8.75538 6.98581 7.8706 7.8706C6.98581 8.75538 6.48875 9.9554 6.48875 11.2067C6.48875 13.8029 8.61042 15.8967 11.2067 15.8967ZM15.0871 43.6458V20.2796H7.35417V43.6458H15.0871Z" fill="#43ACE9" />
                                                 </svg>
                                          </a>
                                          <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/share/18qvrpo3uW/?mibextid=wwXIfr">
                                                 {/* Facebook SVG */}
                                                 <svg xmlns="http://www.w3.org/2000/svg" width="67" height="67" viewBox="0 0 67 67" fill="none">
                                                        <path d="M25.6771 60.0207H36.8438V37.6594H46.9049L48.0104 26.5486H36.8438V20.9373C36.8438 20.1969 37.1379 19.4869 37.6614 18.9633C38.185 18.4398 38.8951 18.1457 39.6354 18.1457H48.0104V6.979H39.6354C35.9335 6.979 32.3831 8.44961 29.7654 11.0673C27.1477 13.685 25.6771 17.2354 25.6771 20.9373V26.5486H20.0938L18.9883 37.6594H25.6771V60.0207Z" fill="#43ACE9" />
                                                 </svg>
                                          </a>
                                   </div>
                                   <div className="contact-container">
                                          <div className="contact-item">
                                                 <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                                        <path d="M3.33203 11.6665L16.9402 21.1922C18.0422 21.9636 18.5932 22.3493 19.1925 22.4987C19.7219 22.6306 20.2755 22.6306 20.8049 22.4987C21.4042 22.3493 21.9552 21.9636 23.0572 21.1922L36.6654 11.6665M11.332 33.3332H28.6654C31.4656 33.3332 32.8658 33.3332 33.9353 32.7882C34.8761 32.3088 35.641 31.5439 36.1204 30.6031C36.6654 29.5336 36.6654 28.1334 36.6654 25.3332V14.6665C36.6654 11.8662 36.6654 10.4661 36.1204 9.39655C35.641 8.45574 34.8761 7.69084 33.9353 7.21147C32.8658 6.6665 31.4656 6.6665 28.6654 6.6665H11.332C8.53177 6.6665 7.13164 6.6665 6.06208 7.21147C5.12127 7.69084 4.35637 8.45574 3.877 9.39655C3.33203 10.4661 3.33203 11.8662 3.33203 14.6665V25.3332C3.33203 28.1334 3.33203 29.5336 3.877 30.6031C4.35637 31.5439 5.12127 32.3088 6.06208 32.7882C7.13164 33.3332 8.53177 33.3332 11.332 33.3332Z" stroke="#23262F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                 </svg>
                                                 support@xpertbid.com
                                          </div>
                                          <div className="contact-item">
                                                 <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                                        <path d="M23.4148 10.0002C25.0427 10.3178 26.5388 11.1139 27.7116 12.2867C28.8844 13.4595 29.6805 14.9556 29.9981 16.5835M23.4148 3.3335C26.7969 3.70922 29.9508 5.22379 32.3585 7.62851C34.7663 10.0332 36.2848 13.1852 36.6648 16.5668M17.0431 23.1053C15.0405 21.1026 13.4592 18.8382 12.2992 16.4222C12.1994 16.2144 12.1495 16.1105 12.1112 15.979C11.975 15.5117 12.0728 14.938 12.3561 14.5423C12.4359 14.4309 12.5311 14.3357 12.7217 14.1451C13.3043 13.5625 13.5957 13.2711 13.7862 12.9782C14.5045 11.8733 14.5045 10.449 13.7862 9.34422C13.5957 9.05125 13.3043 8.75992 12.7217 8.17724L12.3969 7.85245C11.5111 6.96672 11.0683 6.52385 10.5926 6.28327C9.6467 5.80482 8.52959 5.80482 7.58366 6.28327C7.10802 6.52385 6.66515 6.96672 5.77942 7.85245L5.51669 8.11518C4.63399 8.99788 4.19264 9.43924 3.85556 10.0393C3.48152 10.7051 3.21259 11.7393 3.21486 12.503C3.2169 13.1912 3.35041 13.6616 3.61742 14.6023C5.05237 19.658 7.75983 24.4286 11.7398 28.4086C15.7198 32.3885 20.4904 35.096 25.546 36.531C26.4868 36.798 26.9571 36.9315 27.6454 36.9335C28.4091 36.9358 29.4432 36.6669 30.1091 36.2928C30.7091 35.9557 31.1505 35.5144 32.0332 34.6317L32.2959 34.369C33.1817 33.4832 33.6245 33.0404 33.8651 32.5647C34.3436 31.6188 34.3436 30.5017 33.8651 29.5557C33.6245 29.0801 33.1817 28.6372 32.2959 27.7515L31.9711 27.4267C31.3885 26.844 31.0971 26.5527 30.8042 26.3622C29.6993 25.6439 28.275 25.6439 27.1702 26.3622C26.8773 26.5527 26.5859 26.844 26.0032 27.4267C25.8127 27.6172 25.7175 27.7125 25.6061 27.7922C25.2104 28.0756 24.6366 28.1734 24.1694 28.0372C24.0379 27.9989 23.934 27.949 23.7262 27.8492C21.3101 26.6892 19.0457 25.1079 17.0431 23.1053Z" stroke="#23262F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                 </svg>
                                                 +923022113202
                                          </div>

                                          <div className="contact-item">
                                                 <svg style={{ width: "60px" }} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                                                        <path d="M8.33203 23.8108C5.24643 25.1719 3.33203 27.0688 3.33203 29.1668C3.33203 33.309 10.794 36.6668 19.9987 36.6668C29.2034 36.6668 36.6654 33.309 36.6654 29.1668C36.6654 27.0688 34.751 25.1719 31.6654 23.8108M29.9987 13.3335C29.9987 20.1063 22.4987 23.3335 19.9987 28.3335C17.4987 23.3335 9.9987 20.1063 9.9987 13.3335C9.9987 7.81065 14.4759 3.3335 19.9987 3.3335C25.5215 3.3335 29.9987 7.81065 29.9987 13.3335ZM21.6654 13.3335C21.6654 14.254 20.9192 15.0002 19.9987 15.0002C19.0782 15.0002 18.332 14.254 18.332 13.3335C18.332 12.413 19.0782 11.6668 19.9987 11.6668C20.9192 11.6668 21.6654 12.413 21.6654 13.3335Z" stroke="#23262F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                 </svg>
                                                 <span className="ms-1" style={{ fontSize: "18px" }}>9A/2/1, Golf Course Road 2, phase 4, DHA</span>
                                          </div>
                                   </div>
                            </div>

                            <div className="col-md-6">
                                   <div className="ms-md-auto contact-form shadow-lg bg-white">
                                          <h2 className="fw-bolder my-4 text-gray-900">Fill up form</h2>

                                          {/* Success Popup */}
                                          {showSuccessPopup && (
                                                 <SuccessPopup
                                                        isOpen={showSuccessPopup}
                                                        onClose={() => setShowSuccessPopup(false)}
                                                        message={successPopupMessage}
                                                        subMessage={successPopupSubMessage}
                                                 />
                                          )}

                                          {/* Error Popup */}
                                          {showErrorPopup && (
                                                 <ErrorPopup
                                                        isOpen={showErrorPopup}
                                                        onClose={() => setShowErrorPopup(false)}
                                                        message={errorPopupMessage}
                                                        subMessage={errorPopupSubMessage}
                                                 />
                                          )}

                                          <form onSubmit={handleSubmit} noValidate className="text-gray-900">
                                                 <div>
                                                        <label>Full Name</label>
                                                        <input
                                                               type="text"
                                                               name="name"
                                                               value={data.name}
                                                               onChange={handleChange}
                                                               className="ps-4"
                                                               required
                                                        />
                                                        {errors.name && <p className="text-danger small">{errors.name}</p>}
                                                 </div>
                                                 <div>
                                                        <label>Email</label>
                                                        <input
                                                               type="email"
                                                               name="email"
                                                               value={data.email}
                                                               onChange={handleChange}
                                                               className="ps-4"
                                                               required
                                                        />
                                                        {errors.email && <p className="text-danger small">{errors.email}</p>}
                                                 </div>
                                                 <div>
                                                        <label>Phone Number</label>
                                                        <input
                                                               type="number"
                                                               name="subject"
                                                               value={data.subject}
                                                               onChange={handleChange}
                                                               className="ps-4"
                                                               required
                                                        />
                                                        {errors.subject && <p className="text-danger small">{errors.subject}</p>}
                                                 </div>
                                                 <div>
                                                        <label>Message</label>
                                                        <textarea
                                                               name="message"
                                                               value={data.message}
                                                               onChange={handleChange}
                                                               className="ps-4"
                                                               required
                                                        />
                                                        {errors.message && <p className="text-danger small">{errors.message}</p>}
                                                 </div>
                                                 <div className="text-center">
                                                        <button type="submit" className="py-4" disabled={processing}>
                                                               {processing ? "Sending..." : "Send"}
                                                        </button>
                                                 </div>
                                          </form>
                                   </div>
                            </div>
                     </div>
              </div>
       );
};

export default ContactForm;
