local findOrCreateRemote = require(script.Parent.internal).findOrCreateRemote

--- ServerEvent
local ServerEvent = {}
ServerEvent.__index = ServerEvent

function ServerEvent.new(...)
    local self = setmetatable({}, ServerEvent)
    self:constructor(...)
    return self
end

function ServerEvent:constructor(name, middlewares, ...)
    self.instance = findOrCreateRemote("RemoteEvent", name)
    self.middlewares = middlewares
end

function ServerEvent:Connect(callback)
    local middlewares = self.middlewares

    self.instance:Connect(function(source, ...) 
        local args = {...}

        local customSource
        if middlewares then
            for i = 1, #middlewares do
                local middleware = middlewares[i]
                args, customSource = middleware(args, source)
            end
        end

        if args ~= nil then
            callback(customSource or source, unpack(args))
        else
            warn("[rbx-net] Dropping event message from " .. tostring(source))
        end
    end)
end

return ServerEvent