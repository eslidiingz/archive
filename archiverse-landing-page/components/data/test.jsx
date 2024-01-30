// export const text = [
//   {
//     id: "1",
//     text: "text",
//     link: "google.co.th",
//     value: "text",
//   },
//   {
//     id: "2",
//     text: "text2",
//     link: "google.co.th",
//     value: "text2",
//   },
// ];

// export const text2 = [
//   {
//     id: "1",
//     text: "text",
//     link: "google.co.th",
//     value: "text",
//   },
//   {
//     id: "2",
//     text: "text2",
//     link: "google.co.th",
//     value: "text2",
//   },
//   {
//     id: "3",
//     text: "text3",
//     link: "google.co.th",
//     value: "text3",
//   },
// ];

export const text = [
  {
    id: 1,
    text: "text1",
  },
  {
    id: 2,
    text: "text2",
  },
  {
    id: 3,
    text: "Jump to google",
    link: "http://google.co.th",
  },
  {
    id: 4,
    text: "text",
    clickable: true,
    function: () => logout(),
  },
];

const logout = () => {
  alert("You are logged out");
};
