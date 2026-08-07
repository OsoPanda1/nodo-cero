// ==================================================================
// Scripts/GameCore/WebGLBridge.cs
// ------------------------------------------------------------------
// Puente WebGL entre el motor Unity y el host (Next.js / React).
// - JS -> C#: el host invoca `SendMessage("RDM Arena", ...)` sobre los
//   métodos públicos expuestos aquí.
// - C# -> JS: este bridge envía eventos JSON al host mediante el
//   plugin nativo RDMWebGL.jslib (solo aplicable en build WebGL).
// ==================================================================

using System;
using System.Runtime.InteropServices;
using UnityEngine;

namespace RDM.YUN.GameCore
{
    public sealed class WebGLBridge : MonoBehaviour
    {
        public static WebGLBridge Instance { get; private set; }

#if UNITY_WEBGL && !UNITY_EDITOR
        [DllImport("__Internal")]
        private static extern void RDMNotify(string json);
#else
        private static void RDMNotify(string json)
        {
            Debug.Log($"[RDM-BRIDGE] {json}");
        }
#endif

        private const string GameObjectName = "RDM Arena";

        public string HostBaseUrl { get; private set; } = string.Empty;
        public bool HostConnected { get; private set; }

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        private void Start()
        {
            Notify("ready", new
            {
                version = "1.0.0",
                player = "guardian",
                scene = "RDMArena",
            });
        }

        // ------------------------------------------------------------
        // JS -> C#: comandos del host (llamados con SendMessage)
        // ------------------------------------------------------------

        // Configura la base URL del backend YUN del host web y acredita
        // la sesión ya emitida por el navegador (server-authoritative).
        public void ConnectHost(string json)
        {
            try
            {
                var data = JsonUtility.FromJson<HostConnectDto>(json);
                HostBaseUrl = string.IsNullOrEmpty(data.baseUrl) ? "/api/gamification" : data.baseUrl;
                HostConnected = true;

                if (!string.IsNullOrEmpty(data.sessionId) && !string.IsNullOrEmpty(data.token))
                {
                    var score = FindObjectOfType<ScoreClient>();
                    var auth = FindObjectOfType<Networking.AuthClient>();
                    if (score != null && auth != null)
                    {
                        auth.SetSession(data.sessionId, data.token);
                    }
                }

                Notify("host-connected", new { baseUrl = HostBaseUrl });
            }
            catch (Exception ex)
            {
                Notify("error", new { source = "connect-host", message = ex.Message });
            }
        }

        public void PauseGame(string flag)
        {
            Time.timeScale = flag == "true" ? 0f : 1f;
            Notify("paused", new { paused = Time.timeScale == 0f });
        }

        public void EndSession()
        {
            var score = FindObjectOfType<ScoreClient>();
            if (score != null) score.EndSession();
            Notify("session-ended", new { ok = true });
        }

        public void ResetArena()
        {
            var game = GameManager.Instance;
            if (game != null) game.GameOver();
            Notify("reset", new { ok = true });
        }

        // ------------------------------------------------------------
        // C# -> JS: notificaciones al host
        // ------------------------------------------------------------

        public void NotifySessionStarted(string sessionId)
        {
            Notify("session-started", new { sessionId });
        }

        public void NotifyKill(string archetypeId, int basePoints, int comboCount, int totalPoints)
        {
            Notify("kill", new { archetypeId, basePoints, comboCount, totalPoints });
        }

        public void NotifyWave(int waveNumber)
        {
            Notify("wave", new { waveNumber });
        }

        public void NotifyScore(int totalPoints)
        {
            Notify("score", new { totalPoints });
        }

        public void NotifyGameOver(int totalPoints, int waveNumber)
        {
            Notify("game-over", new { totalPoints, waveNumber });
        }

        private void Notify(string type, object payload)
        {
            var message = new BridgeMessageDto
            {
                type = type,
                source = "unity-rdm-invasion",
                timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                payload = payload,
            };
            RDMNotify(JsonUtility.ToJson(message));
        }

        [Serializable]
        public class BridgeMessageDto
        {
            public string type;
            public string source;
            public long timestamp;
            public object payload;
        }

        [Serializable]
        public class HostConnectDto
        {
            public string baseUrl;
            public string sessionId;
            public string token;
        }
    }
}
