import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: "#3E4A57",
    borderRadius: 20,
    marginLeft: 20,
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    top: 5,
    left: -10,
    position: "absolute",
    zIndex: 2,
  },
  headerContainer: {
    position: 'absolute',
    zIndex: 10,
    padding: 20,
    width: '100%',
    // backgroundColor: 'red',
    // paddingHorizontal: 100,
    marginTop: 20,
    // display: 'flex',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // backgroundColor: '#ffffff87',
  },
  headerInside:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: '#ffffff87',
  },
  userImage: {
    height: 45,
    width: 45,
    borderRadius: 100,
    marginLeft: 10,
  },
  placeListContainer: {
    position: 'absolute',
    bottom: 10,
    marginLeft: 10,
    paddingRight: 15,
    width: '100%',
    zIndex: 10,
  }

})
