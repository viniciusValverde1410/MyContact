import React, { useState } from "react";
import { View, FlatList, Alert, StyleSheet, Text } from "react-native";
import {
  Provider as PaperProvider,
  FAB,
  List,
  Dialog,
  Portal,
  Button,
  TextInput,
  Avatar,
  RadioButton,
} from "react-native-paper";

export default function ContactApp() {
  const [contacts, setContacts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [contactForm, setContactForm] = useState({
    nome: "",
    numero: "",
    categoria: "pessoal", // default category
  });

  const openDialogForNew = () => {
    setContactForm({ nome: "", numero: "", categoria: "pessoal" });
    setEditIndex(null);
    setVisible(true);
  };

  const openDialogForEdit = (index) => {
    const contact = contacts[index];
    setContactForm(contact);
    setEditIndex(index);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setEditIndex(null);
    setContactForm({ nome: "", numero: "", categoria: "pessoal" });
  };

  // Função que valida e permite entrada apenas de números e sem espaços no número
  const handleNumeroChange = (text) => {
    // Remove tudo que não for número
    const onlyNumbers = text.replace(/[^0-9]/g, "");
    setContactForm({ ...contactForm, numero: onlyNumbers });
  };

  const saveContact = () => {
    const nomeTrimmed = contactForm.nome.trim();
    const numeroTrimmed = contactForm.numero.trim();
    const categoriaTrimmed = contactForm.categoria.trim().toLowerCase();

    if (!nomeTrimmed || !numeroTrimmed) {
      Alert.alert("Erro", "Nome e Número são obrigatórios.");
      return;
    }

    const newContact = {
      nome: nomeTrimmed,
      numero: numeroTrimmed,
      categoria: categoriaTrimmed,
    };

    let newContacts = [...contacts];
    if (editIndex !== null) {
      newContacts[editIndex] = newContact;
    } else {
      newContacts.push(newContact);
    }
    setContacts(newContacts);
    hideDialog();
  };

  const confirmDelete = (index) => {
    Alert.alert(
      "Excluir contato?",
      `Deseja realmente excluir "${contacts[index].nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            let newContacts = [...contacts];
            newContacts.splice(index, 1);
            setContacts(newContacts);
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }) => (
    <List.Item
      title={item.nome}
      description={`${item.numero} - ${item.categoria}`}
      left={(props) => (
        <Avatar.Text {...props} label={item.nome.charAt(0).toUpperCase()} />
      )}
      right={(props) => (
        <View style={styles.actionButtons}>
          <Button onPress={() => openDialogForEdit(index)} icon="pencil" compact />
          <Button
            onPress={() => confirmDelete(index)}
            icon="delete"
            compact
            color="#FFEB74"
          />
        </View>
      )}
    />
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        {contacts.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum contato ainda!</Text>
        ) : (
          <FlatList data={contacts} keyExtractor={(_, i) => i.toString()} renderItem={renderItem} />
        )}

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={openDialogForNew}
          label="Novo Contato"
        />

        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>{editIndex !== null ? "Editar Contato" : "Adicionar Contato"}</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Nome"
                value={contactForm.nome}
                onChangeText={(text) =>
                  setContactForm({ ...contactForm, nome: text })
                }
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Número"
                value={contactForm.numero}
                onChangeText={handleNumeroChange}
                mode="outlined"
                keyboardType="number-pad"
                maxLength={11}
                style={styles.input}
              />

              <Text style={{ marginBottom: 8, fontWeight: "bold" }}>
                Categoria
              </Text>
              <RadioButton.Group
                onValueChange={(value) =>
                  setContactForm({ ...contactForm, categoria: value })
                }
                value={contactForm.categoria}
              >
                <View style={styles.radioRow}>
                  <View style={styles.radioItem}>
                    <RadioButton value="trabalho" />
                    <Text style={styles.radioLabel}>Trabalho</Text>
                  </View>
                  <View style={styles.radioItem}>
                    <RadioButton value="pessoal" />
                    <Text style={styles.radioLabel}>Pessoal</Text>
                  </View>
                  <View style={styles.radioItem}>
                    <RadioButton value="família" />
                    <Text style={styles.radioLabel}>Família</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Cancelar</Button>
              <Button onPress={saveContact}>{editIndex !== null ? "Salvar" : "Adicionar"}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#FF394E",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    marginBottom: 12,
  },
  radioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioLabel: {
    fontSize: 16,
  },
});

