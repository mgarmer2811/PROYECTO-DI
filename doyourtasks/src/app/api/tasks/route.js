import supabase from "../../../../utils/supabase";

export async function GET(request) {
    const { id } = await request.json();
    const { data: notes, error } = await supabase
        .from("note")
        .select("*")
        .eq("user_id", id)
        .eq("category", category);

    if (error) {
        return new Response(JSON.stringify({ error: "Server error" }), {
            status: 404,
        });
    }
    return new Response(JSON.stringify(notes), { status: 200 });
}

//////////////////////////////////////////////////////////////////////////

export async function POST(request) {
    const { text, category, user_id, due_date } = await request.json();
    const { data, error } = await supabase.from("note").insert([
        {
            text: text,
            category: category,
            user_id: user_id,
            due_date: due_date,
        },
    ]);

    if (error) {
        return new Response(JSON.stringify({ error: "Error adding note" }), {
            status: 400,
        });
    }

    return new Response(JSON.stringify({ sucess: "Note added succesfully" }), {
        status: 200,
    });
}

//////////////////////////////////////////////////////////////////////////

export async function DELETE(request) {
    const { id } = await request.json();
    const { data, error } = await supabase.from("note").delete().eq("id", id);

    if (error) {
        return new Response(JSON.stringify({ error: "Error deleting note" }), {
            status: 400,
        });
    }

    return new Response(JSON.stringify({ sucess: "Note deleted" }), {
        status: 200,
    });
}
