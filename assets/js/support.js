// Carnage Remaps - Support Ticket System
(function() {
  'use strict';

  const SUPPORT_DB = 'CarnageSupportDB';
  const SUPPORT_VERSION = 1;
  const TICKETS_STORE = 'tickets';
  let supportDB = null;

  // Initialize Support Database
  async function initSupportDB() {
    return new Promise((resolve, reject) => {
      // If already initialized, just resolve
      if (supportDB) {
        console.log('Support DB already initialized');
        resolve(supportDB);
        return;
      }
      
      const request = indexedDB.open(SUPPORT_DB, SUPPORT_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        supportDB = request.result;
        console.log('Support DB initialized successfully');
        resolve(supportDB);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains(TICKETS_STORE)) {
          const ticketsStore = db.createObjectStore(TICKETS_STORE, { keyPath: 'id', autoIncrement: true });
          ticketsStore.createIndex('userId', 'userId', { unique: false });
          ticketsStore.createIndex('status', 'status', { unique: false });
          ticketsStore.createIndex('priority', 'priority', { unique: false });
          ticketsStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
    });
  }

  // Create ticket
  function createTicket(ticketData) {
    return new Promise((resolve, reject) => {
      if (!supportDB) {
        reject(new Error('Support database not initialized'));
        return;
      }
      
      const transaction = supportDB.transaction([TICKETS_STORE], 'readwrite');
      const store = transaction.objectStore(TICKETS_STORE);
      
      const ticket = {
        ...ticketData,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: ticketData.messages || []
      };
      
      const request = store.add(ticket);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Get all tickets
  function getAllTickets() {
    return new Promise((resolve, reject) => {
      if (!supportDB) {
        reject(new Error('Support database not initialized'));
        return;
      }
      
      const transaction = supportDB.transaction([TICKETS_STORE], 'readonly');
      const store = transaction.objectStore(TICKETS_STORE);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Get tickets by user ID
  function getTicketsByUserId(userId) {
    return new Promise((resolve, reject) => {
      if (!supportDB) {
        reject(new Error('Support database not initialized'));
        return;
      }
      
      const transaction = supportDB.transaction([TICKETS_STORE], 'readonly');
      const store = transaction.objectStore(TICKETS_STORE);
      const index = store.index('userId');
      const request = index.getAll(userId);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Get ticket by ID
  function getTicketById(ticketId) {
    return new Promise((resolve, reject) => {
      if (!supportDB) {
        reject(new Error('Support database not initialized'));
        return;
      }
      
      const transaction = supportDB.transaction([TICKETS_STORE], 'readonly');
      const store = transaction.objectStore(TICKETS_STORE);
      const request = store.get(ticketId);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Update ticket
  function updateTicket(ticketId, updates) {
    return new Promise(async (resolve, reject) => {
      const ticket = await getTicketById(ticketId);
      if (!ticket) {
        reject(new Error('Ticket not found'));
        return;
      }
      
      const updatedTicket = {
        ...ticket,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      const transaction = supportDB.transaction([TICKETS_STORE], 'readwrite');
      const store = transaction.objectStore(TICKETS_STORE);
      const request = store.put(updatedTicket);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Add message to ticket
  async function addMessageToTicket(ticketId, message, senderId, senderName, senderRole) {
    const ticket = await getTicketById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    const newMessage = {
      id: Date.now(),
      senderId: senderId,
      senderName: senderName,
      senderRole: senderRole,
      message: message,
      timestamp: new Date().toISOString()
    };
    
    ticket.messages.push(newMessage);
    ticket.updatedAt = new Date().toISOString();
    
    return updateTicket(ticketId, { messages: ticket.messages });
  }

  // Delete ticket
  function deleteTicket(ticketId) {
    return new Promise((resolve, reject) => {
      const transaction = supportDB.transaction([TICKETS_STORE], 'readwrite');
      const store = transaction.objectStore(TICKETS_STORE);
      const request = store.delete(ticketId);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get ticket statistics
  async function getTicketStats() {
    const tickets = await getAllTickets();
    
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in-progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      closed: tickets.filter(t => t.status === 'closed').length,
      highPriority: tickets.filter(t => t.priority === 'high').length
    };
  }

  // Update ticket status (helper function for admins)
  async function updateTicketStatus(ticketId, newStatus) {
    return updateTicket(ticketId, { status: newStatus });
  }
  
  // Check if DB is initialized
  function isInitialized() {
    return supportDB !== null;
  }

  // Export support functions
  window.CarnageSupport = {
    init: initSupportDB,
    isInitialized: () => supportDB !== null,
    createTicket,
    getAllTickets,
    getTicketsByUserId,
    getTicketById,
    updateTicket,
    updateTicketStatus,
    addMessageToTicket,
    deleteTicket,
    getTicketStats
  };

})();
