import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { ScrollArea } from '../ui/scroll-area'
import { convertUnicode } from '@/lib/unicode'
import PlayerDialog from '../dialogs/player'
import { RefreshCcw, SearchXIcon } from 'lucide-react'
import { useAPI } from '../api-provider'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import unidecode from 'unidecode'
import { useEffect, useRef, useState } from 'react'
import { players, server } from '@/main'
import fuzzysearch from '@/lib/utils'

function Dashboard() {
  const [search, setSearch] = useState('')
  const { api } = useAPI()

  const player_filter = (player: Player) => {
    const name = unidecode(convertUnicode(player.displayName)).toLowerCase()
    const input = unidecode(convertUnicode(search.trim())).toLowerCase()

    return fuzzysearch(input, name) || player.playfabId.toLowerCase().includes(input)
  }

  const player_sort = (a: Player, b: Player) => {
    const nameA = unidecode(convertUnicode(a.displayName)).toLowerCase()
    const nameB = unidecode(convertUnicode(b.displayName)).toLowerCase()
    return nameA.localeCompare(nameB)
  }

  const player_list = players.value.filter(player_filter).sort(player_sort)

  const showPopup = unidecode(convertUnicode(search.trim())) !== search.trim()
  const [animateRefresh, setAnimateRefresh] = useState(false)

  const containerHeight = window.innerHeight - 90
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${window.innerHeight - 125}px`
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="mx-10 h-screen">
      <div className="flex gap-1">
        <Button
          variant="outline"
          className="group"
          onClick={() => {
            api.command({ type: 'list_players', server: server.value || 'unknown' })

            setAnimateRefresh(true)
            setTimeout(() => setAnimateRefresh(false), 1000)
          }}
        >
          <RefreshCcw className={`animate-ease-in-out ${animateRefresh && 'animate-spin'}`} />
        </Button>
        <div className="grow">
          <Input
            placeholder="Search by Name or ID"
            className="caret-white"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.1 }}
            className="p-2 mt-2 bg-chart-1/10 border-2 border-dashed rounded-sm border-chart-1/50"
          >
            <div className="flex items-center justify-center">
              <span className="text-3xl animate-wiggle-more animate-twice animate-delay-500 animate-ease-in-out animate-alternate-reverse animate-fill-both">
                👋
              </span>
              <span className="text-xs text-muted-foreground">
                Looks like your search contains some 🤔 characters
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-xs text-muted-foreground">
                so we've went ahead and decoded it for you:
              </span>
            </div>
            <div className="flex items-center justify-center">
              <span className="pl-1 text-xs">{unidecode(convertUnicode(search.trim()))}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ScrollArea
        className="overflow-auto mt-2"
        ref={containerRef}
        style={{ height: containerHeight }}
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,_1fr))] gap-2">
          <AnimatePresence mode="wait">
            {player_list.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 p-4">
                <div className="flex items-center justify-center">
                  <SearchXIcon className="text-4xl text-muted-foreground" />
                </div>
                <div className="text-center text-muted-foreground">No results :(</div>
              </div>
            ) : (
              player_list.map((player, index) => (
                <Card key={`player-${player.playfabId}-${index}`} player={player} />
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  )
}

interface CardProps {
  player: Player
}

function Card({ player }: CardProps) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="p-1 rounded-lg cursor-pointer border border-input bg-background hover:bg-accent hover:text-accent-foreground">
            <div className="text-sm text-center">{player.displayName}</div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <PlayerDialog player={player} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default Dashboard
