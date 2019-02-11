import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image ,
  TextInput,
  Dimensions,
  Button,
  ToastAndroid
} from 'react-native';
import ImageOverlay from "react-native-image-overlay";
import Voice from 'react-native-voice';

const deviceWidth = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const widthHalves = deviceWidth* 4/5;

var modifyText = function (txt){
    var makeUpper = true;
    var chars = txt.toLowerCase().split("");
    var punc = [" ", "'", ",", "."];
    for (var i = 0; i < chars.length; i ++) {
      if (punc.includes(chars[i]))
      {
        continue
      }
      else if(makeUpper)
      {
        chars[i] = chars[i].toUpperCase();
      }
      
      makeUpper = !makeUpper
    }
    return chars.join("");
  };

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      top: '',
      bottom: '',
      recognized: '',
      started: '',
      results: [],
    };
    Voice.onSpeechStart = this.onSpeechStart.bind(this)
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this)
    Voice.onSpeechResults = this.onSpeechResults.bind(this) 
  }
  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }
  onSpeechStart(e) {
    ToastAndroid.show('Recording!', ToastAndroid.SHORT);
    this.setState({
      started: '√',
    });
  }
  onSpeechRecognized(e) {
    ToastAndroid.show('Understanding!', ToastAndroid.SHORT);
    this.setState({
      recognized: '√',
    });
  }
  onSpeechResults(e) {
    line = e.value[0]
    ntop = line.substring(0,line.length/2);
    nbottom = line.substring(line.length/2, line.length);
    this.setState({
      results: e.value,
      top: ntop,
      bottom: nbottom
    });
  }
  async _startRecognition(e) {
    this.setState({
      recognized: '',
      started: '',
      results: [],
    });
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }
  render() {
    const {top, bottom} = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.overname}>Spongeme</Text>
        <View style={styles.input_container}>
          <TextInput 
            underlineColorAndroid={'transparent'} 
            style={styles.input} 
            value={top} 
            onChangeText={
              (top) => { 
                if (top.length > 18) {top = top.substring(0,top.length - 1)}; 
                this.setState({top})}
              }
            placeholder={'Input top text here'} 
          />
          <TextInput 
            underlineColorAndroid={'transparent'} 
            style={styles.input} 
            value={bottom} 
            onChangeText={
              (bottom) => { 
                if (bottom.length > 18) {bottom = bottom.substring(0,bottom.length - 1)}; 
                this.setState({bottom})}
              } 
            placeholder={'Input bottom text here'} 
          />    
        </View>
        <Button style={styles.recorder}
          onPress={this._startRecognition.bind(this)}
          title="Record"/>
        <ImageOverlay
          source={require("./assets/spongebob.png" )}
          contentPosition="center"
          containerStyle={styles.img}
          overlayAlpha={0}>
            <View>
                <Text style={styles.top}>{modifyText(top)}</Text>
                <Text style={styles.bottom}>{modifyText(bottom)}</Text>
            </View>
        </ImageOverlay>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  overname: {
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'impact',
    fontSize: 56,
    color: 'black',
  },
  img: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  input_container: {
  },
  input: {
    height: 50,
    margin: 5,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
  },
  bottom: {
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'impact',
    fontSize: 56,
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    fontWeight: '800',
    bottom: -80
  },
  top: {
    top: -80,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'impact',
    fontSize: 56,
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    fontWeight: '800'
  },
  recorder: {
    height: 30,
    margin: 5,
  }
});
