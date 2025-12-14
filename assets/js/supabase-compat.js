// Supabase Compatibility Layer
// Makes Supabase modules work with existing main.js code

// Wait for Supabase modules to load with retry
function setupCompatibilityLayer() {
  // Map CarnageAuth to SupabaseAuth
  if (window.SupabaseAuth) {
    window.CarnageAuth = {
      ...window.SupabaseAuth,
      // Add signIn as alias for login
      signIn: window.SupabaseAuth.login.bind(window.SupabaseAuth),
      // Add signUp as alias for register
      signUp: window.SupabaseAuth.register.bind(window.SupabaseAuth),
      // Add signOut as alias for logout
      signOut: window.SupabaseAuth.logout.bind(window.SupabaseAuth)
    };
    console.log('✅ CarnageAuth → SupabaseAuth');
  } else {
    console.log('⚠️ SupabaseAuth not available, falling back to legacy auth');
    // CarnageAuth will be set by auth.js
  }

  // Map CarnageSupport to SupabaseSupport with data transformation
  if (window.SupabaseSupport) {
    // Transform snake_case to camelCase for tickets
    const transformTicket = (ticket) => {
      if (!ticket) return ticket;
      return {
        ...ticket,
        createdAt: ticket.created_at || ticket.createdAt,
        updatedAt: ticket.updated_at || ticket.updatedAt,
        userId: ticket.user_id || ticket.userId,
        userName: ticket.user_name || ticket.userName
      };
    };

    window.CarnageSupport = {
      ...window.SupabaseSupport,
      // Add methods needed by main.js
      init: async () => {
        if (window.SupabaseSupport.init) {
          return await window.SupabaseSupport.init();
        }
        return true;
      },
      isInitialized: () => true, // Supabase is always initialized
      // Wrap methods to transform data
      getAllTickets: async () => {
        const tickets = await window.SupabaseSupport.getAllTickets();
        return tickets.map(transformTicket);
      },
      getTicketsByUserId: async (userId) => {
        const tickets = await window.SupabaseSupport.getTicketsByUserId(userId);
        return tickets.map(transformTicket);
      },
      getTicketById: async (ticketId) => {
        const ticket = await window.SupabaseSupport.getTicketById(ticketId);
        return transformTicket(ticket);
      },
      createTicket: async (subject, message, priority) => {
        const ticket = await window.SupabaseSupport.createTicket(subject, message, priority);
        return transformTicket(ticket);
      },
      updateTicket: async (ticketId, updates) => {
        const ticket = await window.SupabaseSupport.updateTicket(ticketId, updates);
        return transformTicket(ticket);
      },
      updateTicketStatus: async (ticketId, status) => {
        const ticket = await window.SupabaseSupport.updateTicket(ticketId, { status });
        return transformTicket(ticket);
      },
      addMessageToTicket: async (ticketId, message, senderId, senderName, senderRole) => {
        return await window.SupabaseSupport.addMessage(ticketId, message, senderRole === 'admin');
      },
      getTicketStats: async () => {
        return await window.SupabaseSupport.getTicketStats();
      }
    };
    console.log('✅ CarnageSupport → SupabaseSupport (with data transformation)');
  }

  // Map file functions to SupabaseFiles
  if (window.SupabaseFiles) {
    window.getAllFiles = () => window.SupabaseFiles.getAllFiles();
    window.getFileById = (id) => window.SupabaseFiles.getFileById(id);
    window.deleteFile = (id) => window.SupabaseFiles.deleteFile(id);
    window.updateFile = (id, updates) => window.SupabaseFiles.updateFile(id, updates);
    console.log('✅ File functions → SupabaseFiles');
  }

  console.log('🎉 Supabase compatibility layer ready!');
}

// Run immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(setupCompatibilityLayer, 100));
} else {
  setTimeout(setupCompatibilityLayer, 100);
}
