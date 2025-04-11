let localStream
let remoteStream;


//STUN servers - google
let servers=[
    {
        urls:['stun:stun1.1.google.com:19302','stun:stun2.1.google.com:19302']
    }
]

let init= async ()=>{
    localStream=await navigator.mediaDevices.getUserMedia({video:true,audio:false}); 
    document.getElementById('user-1').srcObject =localStream
}

let createOffer=async ()=>{
    let perrconnection= new RTCPeerConnection(servers);
    remoteStream=new MediaStream();
    document.getElementById('user-2').srcObject =remoteStream

    //connects all tracks of localstream to perrconnection
    localStream.getTracks().forEach((track)=>{
        perrconnection.addTrack(track,localStream);
    })

    //connects all tracks from perrconnection to remotestream
    perrconnection.ontrack= async (event)=>{
        EventSource.stream[0].getTracks().forEach((track)=>{
            remoteStream.addTrack(track);
        })
    }
    

    //creat icecandidates
    perrconnection.onicecandidate=async (event)=>{
        if(event.candidate){
            document.getElementById('create-offer').addEventListener('click',createOffer);
        }
    }


    let offer=await perrconnection.createOffer();
    await perrconnection.setLocalDescription(offer);

    document .getElementById('offer-sdp').value=JSON.stringify(perrconnection.localDescription);
}

let createAnswer=async()=>{
    let perrconnection= new RTCPeerConnection(servers);
    remoteStream=new MediaStream();
    document.getElementById('user-2').srcObject =remoteStream

    //connects all tracks of localstream to perrconnection
    localStream.getTracks().forEach((track)=>{
        perrconnection.addTrack(track,localStream);
    })

    //connects all tracks from perrconnection to remotestream
    perrconnection.ontrack= async (event)=>{
        EventSource.stream[0].getTracks().forEach((track)=>{
            remoteStream.addTrack(track);
        })
    }
    

    //creat icecandidates
    perrconnection.onicecandidate=async (event)=>{
        if(event.candidate){
            document.getElementById('create-answer').value=JSON.stringify(perrconnection.localDescription);
        }
    }

    let offer=document.getElementById('offer-dsp').value
    if(!offer) return alert('Get offer from peer first')
    
    offer=JSON.parse(offer);
    await perrconnection.setRemoteDescription(offer);

    let answer=await perrconnection.createAnswer();
    await perrconnection.setLocalDescription(answer);
    document.getElementById('answer-sdp').value=JSON.stringify(answer)
}

document.getElementById('create-offer').addEventListener('click',createOffer);

init();