// Supabase Support Adapter
// Handles support tickets and messages with Supabase

// Use global supabaseClient instead of import
const supabase = window.supabaseClient;

window.SupabaseSupport = {
  async init() {
    console.log('Supabase Support initialized');
    return true;
  },

  // Create ticket
  async createTicket(subject, message, priority = 'normal') {
    const userId = parseInt(sessionStorage.getItem('userId'));

    const { data, error } = await supabase
      .from('support_tickets')
      .insert([
        {
          user_id: userId,
          subject: subject,
          message: message,
          status: 'open',
          priority: priority
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all tickets (admin)
  async getAllTickets() {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        users (
          name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform to include user name
    return (data || []).map(ticket => ({
      ...ticket,
      userName: ticket.users?.name || ticket.users?.email || 'Unknown User'
    }));
  },

  // Get tickets by user
  async getTicketsByUserId(userId) {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get ticket by ID
  async getTicketById(ticketId) {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', ticketId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update ticket
  async updateTicket(ticketId, updates) {
    const { data, error } = await supabase
      .from('support_tickets')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get messages for ticket
  async getMessagesByTicketId(ticketId) {
    const { data, error } = await supabase
      .from('support_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Add message to ticket
  async addMessage(ticketId, message, isAdmin = false) {
    const userId = parseInt(sessionStorage.getItem('userId'));
    const userName = sessionStorage.getItem('userName');

    const { data, error } = await supabase
      .from('support_messages')
      .insert([
        {
          ticket_id: ticketId,
          user_id: userId,
          sender_name: userName,
          message: message,
          is_admin: isAdmin
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Update ticket's updated_at timestamp
    await this.updateTicket(ticketId, {});

    return data;
  },

  // Delete ticket
  async deleteTicket(ticketId) {
    const { error } = await supabase
      .from('support_tickets')
      .delete()
      .eq('id', ticketId);

    if (error) throw error;
    return true;
  },

  // Get ticket statistics (for admin dashboard)
  async getTicketStats() {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('status');

    if (error) throw error;

    const stats = {
      total: data.length,
      open: data.filter(t => t.status === 'open').length,
      pending: data.filter(t => t.status === 'pending').length,
      closed: data.filter(t => t.status === 'closed').length
    };

    return stats;
  }
};

console.log('✅ Supabase Support module loaded');
