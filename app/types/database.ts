// Hand-written companion to the SQL migrations in /supabase/migrations.
// Regenerate via `supabase gen types typescript --schema public > app/types/database.ts`
// once the Supabase CLI is wired up to this project.
//
// The shape matches @supabase/postgrest-js GenericSchema: each table carries
// Row / Insert / Update plus an empty Relationships array.

export type Database = {
  public: {
    Tables: {
      demo_requests: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          work_email: string;
          company: string;
          company_size: string | null;
          role: string | null;
          industry: string | null;
          message: string | null;
          consent: boolean;
          source: string | null;
          user_agent: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          work_email: string;
          company: string;
          company_size?: string | null;
          role?: string | null;
          industry?: string | null;
          message?: string | null;
          consent: boolean;
          source?: string | null;
          user_agent?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["demo_requests"]["Insert"]>;
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          work_email: string;
          company: string | null;
          company_size: string | null;
          role: string | null;
          industry: string | null;
          message: string;
          consent: boolean;
          source: string | null;
          user_agent: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          work_email: string;
          company?: string | null;
          company_size?: string | null;
          role?: string | null;
          industry?: string | null;
          message: string;
          consent: boolean;
          source?: string | null;
          user_agent?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Insert"]>;
        Relationships: [];
      };
      demo_bookings: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          source: DemoBookingSource;
          calcom_booking_uid: string | null;
          calcom_booking_id: number | null;
          attendee_name: string;
          attendee_email: string;
          company: string | null;
          company_size: string | null;
          role: string | null;
          industry: string | null;
          notes: string | null;
          preferred_timeframe: string | null;
          consent: boolean;
          scheduled_start: string | null;
          scheduled_end: string | null;
          timezone: string | null;
          status: DemoBookingStatus;
          raw_payload: Record<string, unknown> | null;
          user_agent: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          source: DemoBookingSource;
          calcom_booking_uid?: string | null;
          calcom_booking_id?: number | null;
          attendee_name: string;
          attendee_email: string;
          company?: string | null;
          company_size?: string | null;
          role?: string | null;
          industry?: string | null;
          notes?: string | null;
          preferred_timeframe?: string | null;
          consent?: boolean;
          scheduled_start?: string | null;
          scheduled_end?: string | null;
          timezone?: string | null;
          status?: DemoBookingStatus;
          raw_payload?: Record<string, unknown> | null;
          user_agent?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["demo_bookings"]["Insert"]>;
        Relationships: [];
      };
      cognitive_rewards_orders: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          status: CognitiveRewardsOrderStatus;
          buyer_name: string;
          buyer_email: string;
          company_name: string;
          team_size: number;
          game_fee: number;
          vat_rate: number;
          vat_amount: number;
          reward_pool: number;
          currency: string;
          total: number;
          locale: string | null;
          consent_terms: boolean;
          consent_gdpr: boolean;
          user_agent: string | null;
          stripe_checkout_session_id: string | null;
          stripe_payment_intent_id: string | null;
          paid_at: string | null;
          stripe_tax_amount: number | null;
          stripe_total: number | null;
          // TEMPORARY - MOCK PAYMENT, REMOVE BEFORE PROD
          payment_provider: CognitiveRewardsPaymentProvider;
          mock_reference: string | null;
          buyer_notified_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          status?: CognitiveRewardsOrderStatus;
          buyer_name: string;
          buyer_email: string;
          company_name: string;
          team_size: number;
          game_fee: number;
          vat_rate: number;
          vat_amount: number;
          reward_pool: number;
          currency?: string;
          total: number;
          locale?: string | null;
          consent_terms?: boolean;
          consent_gdpr?: boolean;
          user_agent?: string | null;
          stripe_checkout_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          paid_at?: string | null;
          stripe_tax_amount?: number | null;
          stripe_total?: number | null;
          // TEMPORARY - MOCK PAYMENT, REMOVE BEFORE PROD
          payment_provider?: CognitiveRewardsPaymentProvider;
          mock_reference?: string | null;
          buyer_notified_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["cognitive_rewards_orders"]["Insert"]>;
        Relationships: [];
      };
      cognitive_rewards_order_players: {
        Row: {
          id: string;
          created_at: string;
          order_id: string;
          name: string;
          email: string;
          role: CognitiveRewardsPlayerRole;
          join_token_hash: string | null;
          invite_claimed_at: string | null;
          invited_at: string | null;
          invite_email_id: string | null;
          invite_error: string | null;
          joined_at: string | null;
          last_seen_at: string | null;
          join_token_encrypted: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          order_id: string;
          name: string;
          email: string;
          role: CognitiveRewardsPlayerRole;
          join_token_hash?: string | null;
          invite_claimed_at?: string | null;
          invited_at?: string | null;
          invite_email_id?: string | null;
          invite_error?: string | null;
          joined_at?: string | null;
          last_seen_at?: string | null;
          join_token_encrypted?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["cognitive_rewards_order_players"]["Insert"]>;
        Relationships: [];
      };
      cognitive_rewards_games: {
        Row: {
          id: string;
          order_id: string;
          created_at: string;
          updated_at: string;
          phase: CognitiveRewardsGamePhase;
          phase_started_at: string;
          language: string;
          host_player_id: string | null;
          team_size: number;
          schedule: Json;
          current_round: number;
          content: Json | null;
          content_source: string | null;
          challenge_text: string | null;
          challenge_verdict: Json | null;
          key_facts: Json | null;
          key_hash: string | null;
          key_attempts: number;
          key_revealed: number;
          started_at: string | null;
          ended_at: string | null;
          result_emails_sent_at: string | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          created_at?: string;
          updated_at?: string;
          phase?: CognitiveRewardsGamePhase;
          phase_started_at?: string;
          language?: string;
          host_player_id?: string | null;
          team_size: number;
          schedule?: Json;
          current_round?: number;
          content?: Json | null;
          content_source?: string | null;
          challenge_text?: string | null;
          challenge_verdict?: Json | null;
          key_facts?: Json | null;
          key_hash?: string | null;
          key_attempts?: number;
          key_revealed?: number;
          started_at?: string | null;
          ended_at?: string | null;
          result_emails_sent_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["cognitive_rewards_games"]["Insert"]>;
        Relationships: [];
      };
      cognitive_rewards_game_intake: {
        Row: { id: string; game_id: string; player_id: string; question_key: string; answer: string; created_at: string };
        Insert: { id?: string; game_id: string; player_id: string; question_key: string; answer: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["cognitive_rewards_game_intake"]["Insert"]>;
        Relationships: [];
      };
      cognitive_rewards_game_rounds: {
        Row: {
          id: string;
          game_id: string;
          round_index: number;
          template: string;
          solver_player_id: string;
          params: Json;
          pieces: Json;
          public_prompt: Json;
          answer_hash: string;
          status: string;
          started_at: string | null;
          ended_at: string | null;
          attempts: number;
          wrong_attempts: number;
          hint_used: boolean;
          stuck_at: string | null;
          acknowledged: Json;
          solved_by_reveal: boolean;
        };
        Insert: {
          id?: string;
          game_id: string;
          round_index: number;
          template: string;
          solver_player_id: string;
          params: Json;
          pieces: Json;
          public_prompt: Json;
          answer_hash: string;
          status?: string;
          started_at?: string | null;
          ended_at?: string | null;
          attempts?: number;
          wrong_attempts?: number;
          hint_used?: boolean;
          stuck_at?: string | null;
          acknowledged?: Json;
          solved_by_reveal?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["cognitive_rewards_game_rounds"]["Insert"]>;
        Relationships: [];
      };
      cognitive_rewards_game_events: {
        Row: { id: number; game_id: string; round_index: number | null; player_id: string | null; type: string; payload: Json | null; created_at: string };
        Insert: { id?: number; game_id: string; round_index?: number | null; player_id?: string | null; type: string; payload?: Json | null; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["cognitive_rewards_game_events"]["Insert"]>;
        Relationships: [];
      };
      cognitive_rewards_game_contributions: {
        Row: { id: number; game_id: string; round_index: number; player_id: string; solver_player_id: string; kind: string; created_at: string };
        Insert: { id?: number; game_id: string; round_index: number; player_id: string; solver_player_id: string; kind: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["cognitive_rewards_game_contributions"]["Insert"]>;
        Relationships: [];
      };
      cognitive_rewards_game_scores: {
        Row: { id: string; game_id: string; player_id: string; components: Json; total: number; share_eur: number; rank: number; highlights: Json; created_at: string };
        Insert: { id?: string; game_id: string; player_id: string; components: Json; total: number; share_eur: number; rank: number; highlights?: Json; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["cognitive_rewards_game_scores"]["Insert"]>;
        Relationships: [];
      };
      cognitive_rewards_payouts: {
        Row: {
          id: string;
          game_id: string;
          player_id: string;
          amount_eur: number;
          status: CognitiveRewardsPayoutStatus;
          holder_name: string | null;
          iban_encrypted: string | null;
          iban_last4: string | null;
          country: string | null;
          details_at: string | null;
          paid_at: string | null;
          payment_reference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          player_id: string;
          amount_eur: number;
          status?: CognitiveRewardsPayoutStatus;
          holder_name?: string | null;
          iban_encrypted?: string | null;
          iban_last4?: string | null;
          country?: string | null;
          details_at?: string | null;
          paid_at?: string | null;
          payment_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["cognitive_rewards_payouts"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      demo_booking_source: DemoBookingSource;
      demo_booking_status: DemoBookingStatus;
      cognitive_rewards_order_status: CognitiveRewardsOrderStatus;
      cognitive_rewards_player_role: CognitiveRewardsPlayerRole;
      cognitive_rewards_game_phase: CognitiveRewardsGamePhase;
      cognitive_rewards_payout_status: CognitiveRewardsPayoutStatus;
    };
  };
};

export type DemoBookingSource = "calcom" | "fallback_form";
export type DemoBookingStatus =
  | "scheduled"
  | "rescheduled"
  | "cancelled"
  | "completed"
  | "pending";

export type CognitiveRewardsOrderStatus =
  | "pending_payment"
  | "awaiting_payment"
  | "paid"
  | "failed"
  | "expired"
  | "cancelled"
  // TEMPORARY - MOCK PAYMENT, REMOVE BEFORE PROD
  | "mock_paid";
export type CognitiveRewardsPlayerRole = "staff" | "manager" | "clevel";
export type CognitiveRewardsGamePhase =
  | "lobby"
  | "intake"
  | "generating"
  | "briefing"
  | "round"
  | "challenge"
  | "judging"
  | "key"
  | "scorecard"
  | "done";
export type CognitiveRewardsPayoutStatus = "awaiting_details" | "ready" | "paid";
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
// TEMPORARY - MOCK PAYMENT, REMOVE BEFORE PROD
export type CognitiveRewardsPaymentProvider = "stripe" | "mock";

export type DemoRequestInsert = Database["public"]["Tables"]["demo_requests"]["Insert"];
export type ContactMessageInsert = Database["public"]["Tables"]["contact_messages"]["Insert"];
export type DemoBookingInsert = Database["public"]["Tables"]["demo_bookings"]["Insert"];
export type DemoBookingRow = Database["public"]["Tables"]["demo_bookings"]["Row"];
export type CognitiveRewardsOrderInsert =
  Database["public"]["Tables"]["cognitive_rewards_orders"]["Insert"];
export type CognitiveRewardsOrderRow = Database["public"]["Tables"]["cognitive_rewards_orders"]["Row"];
export type CognitiveRewardsOrderPlayerInsert =
  Database["public"]["Tables"]["cognitive_rewards_order_players"]["Insert"];
export type CognitiveRewardsOrderPlayerRow =
  Database["public"]["Tables"]["cognitive_rewards_order_players"]["Row"];
