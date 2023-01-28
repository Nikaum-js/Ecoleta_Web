import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Map, Marker, TileLayer } from 'react-leaflet'
import { FiArrowLeft } from 'react-icons/fi'
import { api, IbgeApi } from '../../services/api'

// @ts-ignore
import logo from '../../assets/logo.svg'

import './styles.css'
import { LeafletMouseEvent } from 'leaflet'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface ItemRecicle {
  id: number
  title: string
  image_name: string
  image_url: string
}

interface IbgeUfResponse {
  sigla: string
}

interface IbgeCityResponse {
  nome: string
}

export function CreatePoint() {
  const [items, setItems] = useState<ItemRecicle[]>([])
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  })

  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0, 0,
  ])
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0, 0,
  ])

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value

    setSelectedUf(uf)
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value

    setSelectedCity(city)
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng])
  }

  function handleSelectItem(id: number) {
    const alreadySelectedItems = selectedItems.findIndex((item) => item === id)

    if (alreadySelectedItems >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id)

      setSelectedItems(filteredItems)
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    setFormData({ ...formData, [name]: value })
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const { name, email, whatsapp } = formData
    const uf = selectedUf
    const city = selectedCity
    const [latitude, longitude] = selectedPosition
    const items = selectedItems

    const data = {
      name,
      email,
      whatsapp,
      uf,
      city,
      latitude,
      longitude,
      items,
    }

    try {
      api.post('points', data)

      toast('🦄 Deu tudo certo!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      })
    } catch (err) {
      toast('Algo deu errado!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      })
    }
  }

  useEffect(() => {
    api.get('items').then((response) => {
      setItems(response.data)
    })

    IbgeApi.get<IbgeUfResponse[]>('estados').then((response) => {
      const ufInitials = response.data.map((uf) => uf.sigla)

      setUfs(ufInitials)
    })

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords

      setInitialPosition([latitude, longitude])
    })
  }, [])

  useEffect(() => {
    IbgeApi.get<IbgeCityResponse[]>(`estados/${selectedUf}/municipios`).then(
      (response) => {
        const cityNames = response.data.map((city) => city.nome)

        setCities(cityNames)
      },
    )
  }, [selectedUf])

  return (
    <>
      <ToastContainer />
      <div id="page-create-point">
        <header>
          <img src={logo} alt="" />

          <NavLink to="/">
            <FiArrowLeft />
            Voltar para home
          </NavLink>
        </header>

        <form onSubmit={handleSubmit}>
          <h1>
            Cadastro do <br /> ponto de coleta
          </h1>

          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>

            <div className="field">
              <label htmlFor="name">Nome da entidade</label>

              <input
                type="text"
                name="name"
                id="name"
                onChange={handleInputChange}
              />
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">Email</label>

                <input
                  type="text"
                  name="email"
                  id="email"
                  onChange={handleInputChange}
                />
              </div>

              <div className="field">
                <label htmlFor="whatsapp">Whatsapp</label>

                <input
                  type="number"
                  name="whatsapp"
                  id="whatsapp"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione o endereço no mapa</span>
            </legend>

            <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <Marker position={selectedPosition} />
            </Map>

            <div className="field-group">
              <div className="field">
                <label htmlFor="uf">Estado (UF)</label>
                <select
                  name="uf"
                  id="uf"
                  onChange={handleSelectUf}
                  value={selectedUf}
                >
                  <option value="0">Selecione uma UF</option>
                  {ufs.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="city">Cidade</label>
                <select
                  name="city"
                  id="city"
                  value={selectedCity}
                  onChange={handleSelectCity}
                >
                  <option value="0">Selecione uma cidade</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Itens de coleta</h2>
              <span>Selecione um ou mais itens abaixo</span>
            </legend>

            <ul className="items-grid">
              {items.map((item) => {
                return (
                  <li
                    key={item.id}
                    className={
                      selectedItems.includes(item.id) ? 'selected' : ''
                    }
                    onClick={() => handleSelectItem(item.id)}
                  >
                    <img src={item.image_url} alt={item.title} />
                    <span>{item.title}</span>
                  </li>
                )
              })}
            </ul>
          </fieldset>

          <button type="submit">Cadastrar ponto de coleta</button>
        </form>
      </div>
    </>
  )
}
