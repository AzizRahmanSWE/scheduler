const formatSpots = (spots) => {
  if (spots === 0) {
    return "no spots remaining"
  }
  if (spots === 1) {
    return "1 spot remaining"
  }
  return `${spots} spots remaining`;
};
export default formatSpots;