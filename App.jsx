import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomText from './src/CustomText';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from 'react-native-dialog';

const App = () => {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);

  // modal
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newText, setNewText] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);

  const saveTodos = async saveTodo => {
    try {
      // asyncStorage ekleme setItem ile yapılır
      // bizden 2 değer ister: birincisi key string,
      // ikincisi: value(string), obhjeyi stringe çevirmemiz lazım
      await AsyncStorage.setItem('todos', JSON.stringify(saveTodo));
    } catch (error) {
      console.log('error', error);
    }
  };

  const addTodo = () => {
    if (todo) {
      const updatedTodos = [...todos, {id: uuid.v4(), text: todo}];
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
    }
    setTodo(' ');
  };

  const loadTodos = async () => {
    try {
      // AsyncStorage'dan todos'u çekmek için getItem ile yapılır
      const storedData = await AsyncStorage.getItem('todos');
      // JSON.parse ile stringi objeye çevirdik
      if (storedData) {
        const data = JSON.parse(storedData);
        setTodos(data);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const deleteTodo = async id => {
    try {
      await AsyncStorage.removeItem('todos');
      const updatedTodos = todos?.filter(todo => todo.id !== id);
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
    } catch (error) {
      console.log('error', error);
    }
  };
  // !ios için
  // const updateTodos = id => {
  //   // id'sini bildiğimiz elemanı todos içinde bulmak için find metodu kullanılır
  //   const exitingTodo = todos.find(x => x.id === id);

  //   if (!exitingTodo) return;
  //   Alert.prompt(
  //     'Edit Todo', //kullanıcıya gösterilecek başlık
  //     'Update', //kullanıcının güncelleme yapması için buton üzerinde yazan metindir
  //     // kullanıcının giriş yaptığı metni işleyen fonksiyondur.
  //     newUpdateText => {
  //       if (newUpdateText.trim()) {
  //         const updatedTodos = todos.map(todo =>
  //.          todo.id === id ? {...todo, text: newUpdateText} : todo,
  //         );
  //         setTodos(updatedTodos); //. todos state'i güncellendi
  //         saveTodos(updatedTodos); //asyncStorage güncellendi
  //       }
  //     },
  //     'plain-text', //sadece text girebilir string olarak algılar girilenleri
  //     exitingTodo.text, // default value olarak gelir
  //   );
  // };
  // !android modal kodları
  const updateTodos = id => {
    const exitingTodo = todos.find(x => x.id === id);
    if (!exitingTodo) return;

    setEditTodoId(id);
    setNewText(exitingTodo.text);
    setDialogVisible(true);
  };

  const handleCancel = () => {
    setDialogVisible(false);
    setNewText('');
  };

  const handleSave = () => {
    if (newText.trim()) {
      const updatedTodos = todos.map(todo =>
        todo.id === editTodoId ? {...todo, text: newText} : todo,
      );
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
      setDialogVisible(false);
      setNewText('');
    } else {
      alert('Todo metni boş olamaz.');
    }
  };

  // ! =================================================

  useEffect(() => {
    loadTodos();
  }, []);

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
              value={todo}
            />
            <TouchableOpacity
              onPress={addTodo}
              style={[styles.button, styles.addButton]}>
              <CustomText style={styles.buttonText}>Add</CustomText>
            </TouchableOpacity>
          </View>
        </View>

        {todos.length === 0 && (
          <CustomText style={styles.noTodosText}>
            Todo Bulunmamaktadır.
          </CustomText>
        )}

        <FlatList
          keyExtractor={item => item.id?.toString()}
          data={todos}
          renderItem={({item}) => (
            <View style={styles.todoItem}>
              <CustomText>{item?.text}</CustomText>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => deleteTodo(item?.id)}
                    style={styles.button}>
                    <CustomText style={styles.buttonText}>Delete</CustomText>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => updateTodos(item?.id)}
                    style={[styles.button, styles.updateButton]}>
                    <CustomText style={styles.buttonText}>Update</CustomText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />

        <Dialog.Container visible={dialogVisible}>
          <Dialog.Title>Edit Todo</Dialog.Title>
          <Dialog.Description>Update</Dialog.Description>
          <Dialog.Input
            value={newText}
            onChangeText={text => setNewText(text)}
          />
          <Dialog.Button label="Cancel" onPress={handleCancel} />
          <Dialog.Button label="OK" onPress={handleSave} />
        </Dialog.Container>
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
  noTodosText: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 20,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: 'gray',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 5,
    paddingHorizontal: 10,
  },
});
