import { Image, TextInput, View } from "react-native"

const TextComponent = ({value, handleValue, icon, placeholder}) => {
    return (
      <View style={{backgroundColor: '#FFFFFF', flexDirection: "row"}}>
        <Image source={{uri: icon}} width={15} height={10} />
        <TextInput value={value} onChangeText={handleValue} placeholder={placeholder}/>
      </View>
    );
}

export default TextComponent;