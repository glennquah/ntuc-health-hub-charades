# Security

Do not post credentials or participant information in public issues. Report sensitive findings privately through GitHub private vulnerability reporting if enabled, or contact the repository owner privately.

Browser Supabase keys are public configuration. Authorization must be enforced by database policies. Never place service-role keys in this frontend.

The original Supabase URL and anon key remain in Git history. Before publication, review that project's policies and rotate or retire its credentials if appropriate. Removing values from the latest commit does not remove them from history. No private service-role key was identified in the working tree during cleanup.

The supplied migration targets fresh databases. Review old policies before adapting it to an existing deployment. Public score insertion is intended for casual use and is not protected against forged scores or automated submissions.
