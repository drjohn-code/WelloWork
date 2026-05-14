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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

export type DemoRequestInsert = Database["public"]["Tables"]["demo_requests"]["Insert"];
export type ContactMessageInsert = Database["public"]["Tables"]["contact_messages"]["Insert"];
