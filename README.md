# kitchen_assistant
Applicazione che si occupa di gestire le disponibilità in cucina; sulla pagina principale viene formata automaticamente la lista della spesa in base alle quantità minime volute dall'utente.

## pantry
Componente che ti permette di inserire nuove disponibilità, con le quantità attuali e quelle minime, modificarle ed eliminarle.

### adding (pantry)
Componente che ti permette di aumentare le quantità di item già presenti nel pantry.

### consuming (pantry)
Componente che ti permette di diminuire le quantità di item già presenti nel pantry.

## recipes
Componente in cui si visualizza la tabella contenente le ricette create dall'utente. La funzione delle ricette è quella di creare un insieme di item che vengano rimossi dalle disponibilità tutti in una volta, quando confermata. Include anche le funzionalità di modifica ed eliminazione.

### add (recipes)
Apre un modale in cui creare una nuova ricetta inserendo il nome e gli ingredienti (una Select con gli item registrati e la quantità necessaria). Il pulsante "Save" salva la ricetta e la visualizza nella tabella del componente precedente.

### view (recipes)
Apre un modale che mostra le ricette attuabili con le disponibilità presenti nel pantry.