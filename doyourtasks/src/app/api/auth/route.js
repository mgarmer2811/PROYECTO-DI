import supabase from "../../../../utils/supabase";

export async function POST(request) {
    try {
        const { email, password, username } = await request.json();

        const { data, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (authError) {
            return new Response(JSON.stringify({ error: authError.message }), {
                status: 400,
            });
        }

        const user = {
            id: data.user.id,
            email: email,
            username: username,
        };
        const { error: userError } = await supabase.from("user").insert(user);

        if (userError) {
            return new Response(JSON.stringify({ error: userError.message }), {
                status: 400,
            });
        }

        return new Response(
            JSON.stringify({ success: "Successful sign up!" }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(JSON.stringify({ error: "Error en el servidor" }), {
            status: 500,
        });
    }
}
