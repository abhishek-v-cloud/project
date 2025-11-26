import {useState} from 'react'
import {
  FaUserShield,
  FaPaw,
  FaGlobe,
  FaLanguage,
  FaClock,
  FaSignature,
  FaBattleNet,
} from 'react-icons/fa'
import Header from '../Header'
import './index.css'

const PlayerStats = () => {
  const characterImages = {
    1801: 'https://static.wikia.nocookie.net/freefire/images/c/cb/Rafael.png',
    6201: 'https://static.wikia.nocookie.net/freefire/images/0/0e/Orion.png',
    7106: 'https://dl.dir.freefiremobile.com/common/web_event/official2.ff.garena.all/20249/b09e7f93ec7c7a47dccbd704d8e4d879.png',
    4906: 'https://static.wikia.nocookie.net/freefire/images/2/21/Leon.png',
    6906: 'https://dl.dir.freefiremobile.com/common/web_event/official2.ff.garena.all/20246/ed1e34b6c47b37675eae84daffdf63b1.png',
    2506: 'https://static.wikia.nocookie.net/freefire/images/e/e4/FreeFireKelly.png',
    6501: 'https://static.wikia.nocookie.net/freefire/images/f/f1/Sonia.png',
    6301: 'https://static.wikia.nocookie.net/freefire/images/f/fc/Alvaro.png',
    4805: 'https://static.wikia.nocookie.net/freefire/images/1/13/FreeFireMoco.png',
    3206: 'https://static.wikia.nocookie.net/freefire/images/3/3b/FreeFireHayato.png',
    4202: 'https://static.wikia.nocookie.net/freefire/images/5/53/FreeFireAndrew.png',
    501: 'https://static.wikia.nocookie.net/freefire/images/5/54/Nikita.png',
    806: 'https://static.wikia.nocookie.net/freefire/images/c/c8/Kla.png',
    1001: 'https://static.wikia.nocookie.net/garena-freefire/images/b/bc/Kenta.png',
    1006: 'https://static.wikia.nocookie.net/freefire/images/6/6a/Miguel.png',
    2706: 'https://static.wikia.nocookie.net/freefire/images/8/81/Jota.png',
    2901: 'https://static.wikia.nocookie.net/freefire/images/e/e7/Luqueta.png',
    1701: 'https://static.wikia.nocookie.net/freefire/images/7/7c/Laura.png',
    3006: 'https://static.wikia.nocookie.net/freefire/images/f/f0/Wolfrahh.png',
    3501: 'https://static.wikia.nocookie.net/freefire/images/d/d4/Dasha.png',
    5006: 'https://static.wikia.nocookie.net/freefire/images/8/80/Otho.png',
    5306: 'https://static.wikia.nocookie.net/freefire/images/1/13/Luna.png',
    601: 'https://static.wikia.nocookie.net/freefire/images/a/a1/FreeFireMisha.png',
    706: 'https://static.wikia.nocookie.net/freefire/images/6/68/FreeFireMaxim.png',
    905: 'https://static.wikia.nocookie.net/freefire/images/e/ee/Paloma.png',
    1101: 'https://static.wikia.nocookie.net/freefire/images/8/87/Caroline.png',
    4106: 'https://static.wikia.nocookie.net/freefire/images/5/5c/Shirou.png',
    101: 'https://static.wikia.nocookie.net/freefire/images/f/fb/FFOlivia.png',
    301: 'https://static.wikia.nocookie.net/freefire/images/3/3a/FFFord.png',
    1301: 'https://static.wikia.nocookie.net/freefire/images/f/f0/Antonio.png',
    2004: 'https://static.wikia.nocookie.net/freefire/images/3/3c/FFJoseph.png',
    2805: 'https://static.wikia.nocookie.net/freefire/images/0/09/Kapella.png',
    4601: 'https://static.wikia.nocookie.net/freefire/images/1/17/Thiva.png',
    5206: 'https://static.wikia.nocookie.net/freefire/images/a/a7/Nairi.png',
    22016: 'https://static.wikia.nocookie.net/freefire/images/7/71/Alok.png',
    1206: 'https://static.wikia.nocookie.net/freefire/images/b/b0/Wukong.png',
    1205: 'https://static.wikia.nocookie.net/garena-freefire/images/6/63/Jai.png',
    1901: 'https://static.wikia.nocookie.net/freefire/images/7/76/A124.png',
    3406: 'https://static.wikia.nocookie.net/freefire/images/9/99/K.png',
    3806: 'https://static.wikia.nocookie.net/freefire/images/d/d8/Chrono.png',
    4006: 'https://static.wikia.nocookie.net/freefire/images/1/1c/Skyler.png',
    4706: 'https://static.wikia.nocookie.net/freefire/images/5/5d/Dimitri.png',
    5506: 'https://static.wikia.nocookie.net/freefire/images/8/8a/FFHomer.png',
    5806: 'https://static.wikia.nocookie.net/freefire/images/2/29/Tatsuya.png',
    6006: 'https://static.wikia.nocookie.net/garena-freefire/images/1/1b/Santino.png',
    6806: 'https://static.wikia.nocookie.net/garena-freefire/images/d/d6/Ryden.png',
    5201: 'https://static.wikia.nocookie.net/freefire/images/0/00/JBeibs.png',
    5801: 'https://mrwallpaper.com/images/thumbnail/free-fire-kenta-png-1308kcwzioez6at0.webp',
  }

  const [playerId, setPlayerId] = useState('')
  const [playerInfo, setPlayerInfo] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = e => {
    setPlayerId(e.target.value)
  }

  const getPlayerInfo = async () => {
    if (!playerId) {
      setError('Please enter a player ID')
      return
    }

    setLoading(true)
    setError('')
    setPlayerInfo(null)

    try {
      const response = await fetch(
        `https://id-game-checker.p.rapidapi.com/ff-player-info/${playerId}/IN`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key':
              '71692bc834msh215321b1672f803p163b89jsne63e56fc2068',
            'x-rapidapi-host': 'id-game-checker.p.rapidapi.com',
          },
        },
      )

      if (!response.ok) {
        throw new Error('Error fetching data.')
      }

      const data = await response.json()
      console.log(data.data)

      setLoading(false)
      if (data.error === false) {
        setPlayerInfo(data.data)
      } else {
        setError('Player not found.')
      }
    } catch (err) {
      setLoading(false)
      setError(
        'Something went wrong, or the Player ID should be in the India region.',
      )
    }
  }

  return (
    <>
      <Header />
      <div className="player-stats-container">
        <h1 className="nickname">Player Stats For Free Fire Game</h1>
        <div className="top-bar-card">
          <div className="top-bar">
            <input
              type="text"
              placeholder="Enter Your Free Fire User Id..."
              className="input-field"
              value={playerId}
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="search-btn"
              onClick={getPlayerInfo}
            >
              Search
            </button>
          </div>
          <div className="avatar-container">
            {playerInfo && (
              <img
                src={playerInfo.basicInfo.avatars[1]}
                alt="Player Avatar"
                className="avatar-img"
              />
            )}
          </div>
        </div>

        {loading && <p className="custom-loading">Fetching data...</p>}
        {error && (
          <div className="custom-error">
            <span className="custom-error-icon">
              <i className="fa fa-exclamation-triangle" />
            </span>
            {error}
          </div>
        )}

        <div className="top-bar-card-2">
          {playerInfo && (
            <div className="profile-section">
              <div>
                <h1 className="nickname">{playerInfo.basicInfo.nickname}</h1>
                <h2 className="player-id">
                  Player: <span>{playerInfo.basicInfo.accountId}</span>
                </h2>
                <hr className="divider" />

                <div className="stats-section">
                  {[
                    {label: 'Region', value: playerInfo.basicInfo.region},
                    {label: 'Level', value: playerInfo.basicInfo.level},
                    {label: 'Badges', value: playerInfo.basicInfo.badgeCnt},
                  ].map(stat => (
                    <div key={stat.label} className="stat-item">
                      <h1 className="stat-label">{stat.label || 'N/A'}</h1>
                      <h1 className="stat-value">{stat.value || 'N/A'}</h1>
                    </div>
                  ))}
                </div>

                <div className="rank-section">
                  {[
                    {label: 'BR', value: playerInfo.basicInfo.rank},
                    {label: 'CS', value: playerInfo.basicInfo.csRank},
                    {label: 'Season', value: playerInfo.basicInfo.seasonId},
                  ].map(stat => (
                    <div key={stat.label} className="rank-item">
                      <h1 className="rank-label">{stat.label || 'N/A'}</h1>
                      <h1 className="rank-value">{stat.value || 'N/A'}</h1>
                    </div>
                  ))}
                </div>
              </div>

              {playerInfo && (
                <div className="character-image-container">
                  <img
                    src={`${
                      characterImages[
                        playerInfo.profileInfo.equippedSkills[0].skillId
                      ] ||
                      'https://static.wikia.nocookie.net/freefire/images/7/71/Alok.png'
                    }`}
                    alt={`Character: ${
                      playerInfo.profileInfo.equippedSkills[0].skillId || 'Alok'
                    }`}
                    className="character-image"
                  />
                </div>
              )}
            </div>
          )}

          {playerInfo && (
            <div className="character-section">
              {[
                {
                  slot: 'Slot 1',
                  img: `${
                    characterImages[
                      playerInfo.profileInfo.equippedSkills[1].skillId
                    ] ||
                    'https://static.wikia.nocookie.net/freefire/images/1/13/FreeFireMoco.png'
                  }`,
                  charId: `${playerInfo.profileInfo.equippedSkills[1].skillId}`,
                },
                {
                  slot: 'Slot 2',
                  img: `${
                    characterImages[
                      playerInfo.profileInfo.equippedSkills[2].skillId
                    ] ||
                    'https://static.wikia.nocookie.net/freefire/images/1/17/Thiva.png'
                  }`,
                  charId: `${playerInfo.profileInfo.equippedSkills[2].skillId}`,
                },
                {
                  slot: 'Slot 3',
                  img: `${
                    characterImages[
                      playerInfo.profileInfo.equippedSkills[3].skillId
                    ] ||
                    'https://mrwallpaper.com/images/thumbnail/xayne-as-free-fire-character-26pqlju3q5ryp3pa.webp'
                  }`,
                  charId: `${playerInfo.profileInfo.equippedSkills[3].skillId}`,
                },
              ].map(slot => (
                <div key={slot.slot} className="character-slot">
                  <h1 className="character-slot-name neon-glow ">
                    {slot.slot}
                  </h1>
                  <hr className="character-slot-divider" />
                  <div className="character-slot-image-wrapper">
                    <img
                      src={slot.img}
                      alt={`Character in ${slot.slot}`}
                      className="character-slot-image"
                    />
                  </div>
                  <h1 className="character-slot-info">
                    Player Id:{' '}
                    <span className="span-char-id">{slot.charId}</span>
                  </h1>
                </div>
              ))}
            </div>
          )}

          {playerInfo && (
            <div className="guild-leader-container">
              <div className="guild-leader-mini-container">
                <div className="guild-leader-title">🔥 Guild Leader 🔥</div>

                <div className="guild-leader-info">
                  <span className="guild-leader-label">Nickname:</span>
                  <span className="guild-leader-value">
                    {playerInfo.captainBasicInfo.nickname || 'N/A'}
                  </span>
                </div>

                <div className="guild-leader-info">
                  <span className="guild-leader-label">ID:</span>
                  <span className="guild-leader-value">
                    {playerInfo.captainBasicInfo.accountId || 'N/A'}
                  </span>
                </div>

                <div className="guild-leader-info">
                  <span className="guild-leader-label">Level:</span>
                  <span className="guild-leader-value">
                    {playerInfo.captainBasicInfo.level || 'N/A'}
                  </span>
                </div>

                <div className="guild-leader-info">
                  <span className="guild-leader-label">BR Rank:</span>
                  <span className="guild-leader-value">
                    {playerInfo.captainBasicInfo.rank || 'N/A'}
                  </span>
                </div>

                <div className="guild-leader-info">
                  <span className="guild-leader-label">CS Rank:</span>
                  <span className="guild-leader-value">
                    {playerInfo.captainBasicInfo.csRank || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="top-bar-card-2">
          {playerInfo && (
            <div className="avatar-container-2">
              <div className="avatar-wrapper-2">
                <img
                  src={playerInfo.profileInfo.clothes.images[0]}
                  alt="Player Avatar"
                  className="avatar-image-2"
                />
              </div>
            </div>
          )}

          {playerInfo && (
            <div className="player-info-container">
              <div className="guild-info">
                <div className="icon-container">
                  <FaBattleNet className="icon" />
                </div>
                <div className="details">
                  <h1>
                    🏆 Guild Name:{' '}
                    <span>{playerInfo.clanBasicInfo.clanName || 'N/A'}</span>
                  </h1>
                  <h1>
                    🔰 Guild LVL:{' '}
                    <span>{playerInfo.clanBasicInfo.clanLevel || 'N/A'}</span>
                  </h1>
                  <h1>
                    👥 Members:{' '}
                    <span>
                      {playerInfo.clanBasicInfo &&
                      playerInfo.clanBasicInfo.memberNum !== undefined &&
                      playerInfo.clanBasicInfo.capacity !== undefined
                        ? `${playerInfo.clanBasicInfo.memberNum} / ${playerInfo.clanBasicInfo.capacity}`
                        : 'N/A'}
                    </span>
                  </h1>
                </div>
              </div>

              <div className="pet-info">
                <div className="icon-container">
                  <FaPaw className="icon" />
                </div>
                <div className="details">
                  <p>
                    <strong>🆔 Pet ID:</strong> {playerInfo.petInfo.id || 'N/A'}
                  </p>
                  <p>
                    <strong>🐾 Pet Name:</strong>{' '}
                    {playerInfo.petInfo.name || 'N/A'}
                  </p>
                  <p>
                    <strong>⚡ Pet Exp:</strong>{' '}
                    {playerInfo.petInfo.exp || 'N/A'}
                  </p>
                  <p>
                    <strong>⭐ Pet Level:</strong>{' '}
                    {playerInfo.petInfo.level || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {playerInfo && (
            <div className="social-info-container">
              <div className="social-info-grid">
                <div className="social-info-title">🌐 Social Info</div>

                <div className="social-info-row">
                  <FaUserShield className="social-info-icon" />
                  <span className="social-info-text">🚻 Gender:</span>
                  <span className="social-info-value">
                    {playerInfo.socialInfo.gender || 'N/A'}
                  </span>
                </div>

                <div className="social-info-row">
                  <FaLanguage className="social-info-icon" />
                  <span className="social-info-text">🗣️ Language:</span>
                  <span className="social-info-value">
                    {playerInfo.socialInfo.language || 'N/A'}
                  </span>
                </div>

                <div className="social-info-row">
                  <FaSignature className="social-info-icon" />
                  <span className="social-info-text">🔖 Signature:</span>
                  <span className="social-info-value">
                    {playerInfo.socialInfo.modePrefer || 'N/A'}
                  </span>
                </div>

                <div className="social-info-row">
                  <FaGlobe className="social-info-icon" />
                  <span className="social-info-text">🏆 Rank Display:</span>
                  <span className="social-info-value">
                    {playerInfo.socialInfo.rankShow || 'N/A'}
                  </span>
                </div>

                <div className="social-info-row">
                  <FaClock className="social-info-icon" />
                  <span className="social-info-text">⏳ Last Online:</span>
                  <span className="social-info-value">
                    {playerInfo.socialInfo.timeOnline || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default PlayerStats
