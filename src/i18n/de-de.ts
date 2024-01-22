import { ServerStatusEnum } from "@mypvp/userserver-api-client-browser";

export default {
  layout: {
    imprint: "Impressum",
    privacy: "Datenschutzerklärung",
    members: "Mitglieder",
  },
  user: {
    "private-userservers": "Deine Server",
    "private-domains": "Deine Domains",
  },
  extensions: "Erweiterungen",
  userserver: {
    "allow-join-me": "Erlaube JoinMe's zu erstellen",
    "show-join-me": "Zeige JoinMe's auf Server an",
    "public-status-announce": "Server öffentlich ankündigen beim Start",
    standby: "Standby",
    "server-stats": {
      stats: "Statistik",
      "server-stats": "Server statistiken",
      "unique-player-count": "Dein Server hat schon {playerCount} gesehen",
      "total-playtime":
        "Auf deinen Server haben alle Spieler zusammen {playtime} Spielzeit",
      "top-players": "Spieler mit der meisten Spielzeit",
    },
    shutdown: "Herunterfahren",
    restart: "Neustarten",
    "missing-permissions-for-domain":
      "Der Spieler darf die Domain nicht besitzen",
    "missing-slots-for-domain":
      "Der Spieler hat die maximale Anzahl an Domains",
    "user-not-found": "Der Spieler konnte nicht gefunden werden",
    "user-do-not-accept-domains": "Der Spieler akzeptiert keine Domains",
    notifications: {
      status: {
        archived: "Der Server #{server} wurde archiviert",
        archiving: "Der Server #{server} wird archiviert",
        offline: "Der Server #{server} wurde gestoppt und gespeichert",
        online: "Der Server #{server} ist online",
        starting: "Der Server #{server} wird von {producer} gestartet",
        stopping: "Der Server #{server} wird von {producer} gestoppt",
        restoring: "Der Server #{server} wird wiederhergestellt",
        queued: "",
      } as Record<Lowercase<ServerStatusEnum>, string>,
    },
    logs: {
      analyse: "Analysieren",
      "no-problems-found": "Es wurden keine Fehler gefunden",
    },
    restore: "Wiederherstellen",
    "alias-or-id": "Server alias oder id",
    "server-not-found": "Server konnte nicht gefunden werden",
    extensions: {
      "create-extension": "Erweiterung erstellen",
      name: "Erweiterungsname",
      "menu-item": "Menü Item",
      permission: "Permission",
      type: "Type",
      "create-extension-file": "Erweiterungsdatei erstellen",
      installed: "Installiert",
      types: {
        system: "System",
        worldediting: "Welteditierung",
        skript: "Skript",
        mini_game: "Minispiele",
      },
    },
    admin: "Admin",
    versions: {
      "spigot-1-9-4": "Spigot 1.9.4",
      "spigot-1-8-8": "Spigot 1.8.8",
      "spigot-1-7-10": "Spigot 1.7.10",
      "spigot-1-17-1": "Spigot 1.17.1",
      "spigot-1-17": "Spigot 1.17",
      "spigot-1-16-5-jdk16": "Spigot 1.16.5 (Java 16)",
      "spigot-1-16-5": "Spigot 1.16.5",
      "spigot-1-16-4": "Spigot 1.16.4",
      "spigot-1-16-1": "Spigot 1.16.1",
      "spigot-1-15-2": "Spigot 1.15.2",
      "spigot-1-14-4": "Spigot 1.14.4",
      "spigot-1-13-2": "Spigot 1.13.2",
      "spigot-1-12-2": "Spigot 1.12.2",
      "spigot-1-11-2": "Spigot 1.11.2",
      "spigot-1-10-2": "Spigot 1.10.2",
      "magma-1-12": "Magma 1.12",
      "spigot-1-18": "Spigot 1.18",
      "spigot-1-18-1": "Spigot 1.18.1",
      "spigot-1-18-2": "Spigot 1.18.2",
      "spigot-1-19": "Spigot 1.19",
      "spigot-1-19-1": "Spigot 1.19.1",
      "spigot-1-19-2": "Spigot 1.19.2",
      "spigot-1-19-3": "Spigot 1.19.3",
      "spigot-1-19-4": "Spigot 1.19.4",
      "spigot-1-20-experimental": "Spigot 1.20 EXPERIMENTAL",
    },

    domains: {
      register: "Registrieren",
      "register-domain": "Domain Registrieren",
      "domain-required": "Bitte wähle eine Domain aus",
      "sub-domain-required": "Bitte gebe eine Subdomain ein",
      "sub-domain-not-available": "Subdomain ist nicht verfügbar",
      "connect-to-server": "Mit Server verbinden",
      connect: "Verbinden",
      "transfer-domain": "Domain übertragen",
      transfer: "Übertragen",
      disconnect: "Auflösen",
      "disconnect-dialog": {
        title: "Server verbindung auflösen",
        message: "Möchtest du die Verbindung zu dem Server auflösen?",
      },
      "delete-sub-domain-dialog": {
        title: "Subdomain löschen",
        message:
          "Möchtest du die Subdomain löschen? Nach dem die Sub-Domain gelöscht wurde kann diese wieder von jedem Registriert werden",
      },
    },

    "icon-item": "Item",
    settings: "Server-Einstellungen",
    permissions: "Server-Berechtigungen",
    plugins: "Plugins",
    "my-server": "Meine Server",
    "my-domains": "Meine Domains",
    server: "Server",
    "not-online": "Der Server ist nicht online",
    console: "Konsole",
    create: "Server erstellen",
    name: "Servername",
    alias: "Alias",
    description: "Beschreibung",
    version: "Version",
    slots: "Slots",
    ram: "RAM",
    "min-ram": "Du musst mindestens 512 Mb RAM vergeben",
    "max-ram": "Du hast nur {ram} Mb zu verfügung",
    "min-slots": "Der Server muss mindestens 1 slot haben",
    "max-slots": "Du hast nur {slots} zu verfügung",
    "archived-dialog": {
      title: "Dieser Server wurde Archiviert!",
      message:
        "Der MyServer wurde archiviert, da der MyServer für mehr als einen Monat nicht mehr gestartet wurde (Hierbei bleiben alle Daten bestehen). Nach dem du deinen MyServer wieder wiederherstellt hast kannst du diesen wieder wie gewohnt nutzen",
    },
    status: {
      online: "Online",
      starting: "Startet",
      stopping: "Stoppt",
      offline: "Offline",
      standby: "Standby",
      maintenance: "Wartungsarbeiten",
      queued: "Queued",
      archived: "Archiviert",
      restoring: "Wiederherstellen",
      archiving: "Archivieren",
    },
    overview: {
      title: "Server {name}",
    },
    files: {
      path: "Pfad",
      "saved-file": "Datei gespeichert!",
      edit: "Bearbeiten",
      title: "Server Dateien",
      file: "Datei | Dateien",
      folder: "Ordner | Ordner",
      "new-file": "Neue Datei",
      "new-folder": "Neuer Ordner",
      "file-name": "Dateiname",
      "file-size": "Dateigröße",
      "file-created": "Erstellt",
      "file-changed": "Verändert",
      "upload-file": "Datei hochladen",
      "create-file": "Datei erstellen",
      "create-folder": "Ordner erstellen",
      delete: "Löschen",
      "delete-files-dialog": {
        title: "Möchtest du {count} dateien löschen?",
        message:
          'Möchtest du alle ausgewählten Ordner und Dateien wirklich löschen?"',
        success: "Alle dateien wurden gelöscht",
      },
      create: "Erstellen",
      download: "Herunterladen",
      rename: "Umbenennen",
      "rename-file": "Datei umbenennen",
      "rename-folder": "Ordner umbenennen",
      "no-files": "Keine dateien vorhanden",
      "copy-filename": "Namen kopieren",
      "reload-files": "Dateien neu laden",
      "drop-file": "Datei hier reinziehen",
      "delete-file-dialog": {
        "title-folder": "Möchtest du den Ordner: {name} wirklich löschen?",
        "title-file": "Möchtest du die Datei: {name} wirklich löschen?",
      },
      error: {
        "create-file": "Datei konnte nicht erstellt werden!",
        "load-files": "Dateien konnten nicht geladen werden!",
        "save-file": "Datei konnte nicht geladen werden!",
        "file-already-exists":
          "Eine Datei oder Ordner existiert bereits mit dem namen!",
        "file-extension-not-allowed":
          "Dateiendung nicht erlaubt! Erlaubte Endungen: {allowedExtensions}",
        "file-includes-double-point":
          "Der Dateiname darf kein Doppel Punkt enthalten!",
        "rename-folder": "Ordner konnte nicht umbenannt werden",
        "rename-file": "Datei konnte nicht umbenannt werden",
        "file-includes-slash": "Der Dateiname darf keinen Slash (/) enthalten!",
        "filename-could-not-be-copied": "Der Name konnte nicht kopiert werden!",
        "create-server": "Der Server konnte nicht erstellt werden",
      },
    },
    "delete-server": {
      dialog: {
        title: "Möchtest du deinen Server löschen?",
        message:
          "Bist du dir  sicher, dass du deinen Server löschen möchtest? Sobald sein Server gelöscht ist, gibt es keinen Möglichkeit mehr, den Server wiederherzustellen.",
      },
      "delete-server": "Server löschen",
      failed: "Der Server konnte nicht gelöscht werden",
    },
    "reset-server": {
      dialog: {
        title: "Möchtest du deinen Server zurücksetzen?",
        message:
          "Bist du dir  sicher, dass du deinen Server zurücksetzen möchtest? Sobald sein Server zurückgesetzt ist, gibt es keinen Möglichkeit mehr, die alten Daten wiederherzustellen.",
      },
      "reset-server": "Server zurücksetzen",
      failed: "Der Server konnte nicht zurückgesetzt werden",
    },
    error: {
      "could-not-connect-to-console":
        "Verbindung zur Konsole konnte nicht hergestellt werden!",
    },
  },
  auth: {
    "not-logged-in": {
      introduction: {
        title: "Willkommen im Panel für die MyServer!",
        subtitle:
          "Hier kannst du deine MyServer verwalten, starten, stoppen und aus einer großen Auswahl an verschiedensten Plugins auswählen.",
      },
      "login-link": {
        explanation:
          "Um Zugriff auf das Panel zu erhalten, gehe auf unseren Minecraft Server {address} und gebe dort den Befehl {command} ein",
      },
      "login-forum": {
        title:
          "Alternativ kannst du dich auch über dein Forumbenutzer anmelden",
        button: "Übers Forum anmelden",
        disclaimer:
          "Wichtig: Es ist nur möglich sich über das Forum anzumelden, wenn zuvor der Forumbenutzer mit einem Minecraft Account verknüpft wurde.",
      },
    },
    "minecraft-account-is-not-connected": {
      title: "Minecraft Account ist nicht verknüpft",
      subtitle:
        "Dein Minecraft-Account ist nicht mit deinem Forum-Account verbunden!",
      "link-account": "Account verknüpfen",
      "login-again": "Erneut Anmelden",
    },
  },
  "command-suggestion": {
    copied: "Kopiert!",
    "click-to-copy": "Klicke zum kopieren.",
  },
  owner: "Besitzer",
  member: "Mitglied",
  selected: "ausgewählt",
  cancel: "Abbrechen",
  overview: "Übersicht",
  console: "Konsole",
  yes: "Ja",
  no: "Nein",
  back: "Zurück",
  save: "Speichern",
  create: "Erstellen",
  player: "Spieler",
  permissions: "Berechtigungen",
  config: "Konfiguration",
  "add-permission-to-server": "Berechtigung zum Server hinzufügen",
  delete: "Löschen",
  all: "Alle",
};