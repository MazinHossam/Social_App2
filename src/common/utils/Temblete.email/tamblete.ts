
export const TambleteEmail = (code: number): string => `
<div style="
    margin:0;
    padding:0;
    background:#0f172a;
    font-family:Arial,sans-serif;
    padding:50px 20px;
">
    
    <div style="
        max-width:500px;
        margin:auto;
        background:#1e293b;
        border-radius:20px;
        padding:40px 30px;
        text-align:center;
        box-shadow:0 0 25px rgba(79,70,229,.3);
        border:1px solid rgba(255,255,255,.08);
    ">

        <h1 style="
            color:white;
            margin-bottom:10px;
            font-size:32px;
        ">
            Verify Your Email
        </h1>

        <p style="
            color:#cbd5e1;
            font-size:15px;
            line-height:1.7;
            margin-bottom:30px;
        ">
            Use the verification code below to complete your sign in process.
            This code will expire in 5 minutes.
        </p>

        <div style="
            background:#0f172a;
            padding:18px;
            border-radius:14px;
            margin:25px 0;
            border:1px dashed #4f46e5;
        ">
            <span style="
                color:#4f46e5;
                font-size:38px;
                font-weight:bold;
                letter-spacing:8px;
            ">
                ${code}
            </span>
        </div>

    </div>

</div>
`

