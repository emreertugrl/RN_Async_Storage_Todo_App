import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import CustomText from './src/CustomText';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);

  const saveTodos = async todos => {
    try {
      // asyncStorage ekleme setItem ile yapılır
      // bizden 2 değer ister: birincisi key string,
      // ikincisi: value(string), obhjeyi stringe çevirmemiz lazım
      await AsyncStorage.setItem('todos', JSON.stringify(updateTodos));
    } catch (error) {
      console.log('error', error);
    }
  };

  const addTodo = () => {
    const updatedTodos = [...todos, {id: uuid.v4(), text: todo}];
    setTodos(updatedTodos);
    // saveTodos(updatedTodos)
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <CustomText style={styles.headerText}>
          React Native AsyncStorage
        </CustomText>
        <View style={styles.inputContainer}>
          <View style={styles.buttonContainer}>
            <TextInput
              onChangeText={text => setTodo(text)}
              style={styles.input}
              placeholder="Type a Todo"
              placeholderTextColor={'grey'}
            />
            <TouchableOpacity
              onPress={addTodo}
              style={[styles.button, styles.addButton]}>
              <CustomText style={styles.buttonText}>Add</CustomText>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          keyExtractor={item => item.id?.toString()}
          data={todos}
          renderItem={item => (
            <View style={styles.todoItem}>
              <CustomText>text</CustomText>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button}>
                    <CustomText style={styles.buttonText}>Delete</CustomText>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.updateButton]}>
                    <CustomText style={styles.buttonText}>Update</CustomText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderColor: 'gray',
    borderRadius: 10,
    color: 'black',
    flex: 1,
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    flex: 1,
  },
  inputContainer: {
    // backgroundColor: 'red',
  },
  buttonContainer: {
    flexDirection: 'row',
  },

  button: {
    marginLeft: 10,
    backgroundColor: 'red',
    borderRadius: 10,
    color: 'white',
    padding: 10,
  },
  addButton: {
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  buttonText: {
    color: 'white',
  },
  todoItem: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBlockColor: 'gray',
    borderWidth: 1,
  },
  updateButton: {
    backgroundColor: 'blue',
  },
});
